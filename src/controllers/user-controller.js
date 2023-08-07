const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');

const { response } = require('express');

const getUsers = async (req, res = response) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            ok: true,
            users: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error while performing request'
        });
    }
}

const getUserById = async (req, res = response) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
}

const createUser = async (req, res = response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Username is already registered'
            });
        }

        // Encrypt password
        const salt = bcryptjs.genSaltSync();
        req.body.password = bcryptjs.hashSync(password, salt);
        req.body.createdBy = req.username;
        req.body.updatedBy = req.username;

        const user = await User.create(req.body);
        res.status(200).json({
            ok: true,
            user: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
}

const updateUser = async (req, res = response) => {
    const id = req.params.id;
    try {
        const userDB = await User.findByPk(id);
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User with that id does not exist'
            });
        }

        // Updates
        const { password, username, ...fields } = req.body;

        if (userDB.username !== username) {
            const existingUsername = await User.findOne({ where: { username: username } });
            console.log(username);
            console.log(existingUsername);
            if (existingUsername) {
                return res.status(400).json({
                    ok: false,
                    msg: 'A user with that username already exists'
                });
            }
        }
        fields.username = username;
        const data = await User.update(fields, { where: { userId: id } });
        if (data == 1) {
            res.send({
                message: `User with id: ${id} updated successfully`
            });
        } else {
            res.send({
                message: `Could not update user with id: ${id}`
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const deleteUser = async (req, res = response) => {
    const id = req.params.id;
    try {
        const userDB = await User.findByPk(id);
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User with that id does not exist'
            });
        }

        await User.destroy({ where: { userId: id } });
        
        return res.json({
            ok: true,
            msg: 'User deleted'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
}
