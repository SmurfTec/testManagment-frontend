import { useArray } from 'src/hooks';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { makeReq, handleCatch } from 'src/utils/makeReq';
import { AuthContext } from './AuthContext';
export const UsersContext = React.createContext();

export const UsersProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [
    users,
    setUsers,
    pushUser,
    filterUser,
    updateUser,
    removeUser,
    clearUsers,
  ] = useArray([], '_id');

  const fetchUsers = async () => {
    try {
      const resData = await makeReq(`/users`);
      setUsers(resData.users);
    } catch (err) {
      handleCatch(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (id) => {
    return users.find((el) => el._id === id);
  };

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  // * CRUD Operations
  const createUser = async (state, callback) => {
    try {
      const resData = await makeReq(`/users`, { body: state }, 'POST');
      toast.success('User Created Successfully!');
      pushUser(resData.user);
      callback?.();
    } catch (err) {
      handleCatch(err);
    }
  };

  const editUser = async (id, state, callback) => {
    try {
      const resData = await makeReq(`/users/${id}`, { body: state }, 'PATCH');
      toast.success('User Updated Successfully!');
      updateUser(id, resData.user);
      callback?.();
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await makeReq(`/users/${id}`, {}, 'DELETE');
      toast.success('User Deleted Successfully!');
      removeUser(id);
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <UsersContext.Provider
      displayName='Users Context'
      value={{
        loading,
        users,
        getUserById,
        createUser,
        deleteUser,
        editUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
