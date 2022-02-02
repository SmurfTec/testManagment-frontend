import { useArray } from 'src/hooks';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { makeReq, handleCatch } from 'src/utils/makeReq';
import { AuthContext } from './AuthContext';
export const AssetsContext = React.createContext();

export const AssetsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [
    assets,
    setAssets,
    pushAsset,
    filterAsset,
    updateAsset,
    removeAsset,
    clearAssets,
  ] = useArray([], '_id');

  const fetchAssets = async () => {
    try {
      const resData = await makeReq(`/assets`);
      setAssets(resData.assets);
    } catch (err) {
      handleCatch(err);
    } finally {
      setLoading(false);
    }
  };

  const getAssetById = (id) => {
    return assets.find((el) => el._id === id);
  };

  useEffect(() => {
    if (!user) return;
    fetchAssets();
  }, [user]);

  // * CRUD Operations
  const createAsset = async (state, callback) => {
    try {
      const resData = await makeReq(`/assets`, { body: state }, 'POST');
      toast.success('Asset Created Successfully!');
      pushAsset(resData.asset);
      callback?.();
    } catch (err) {
      handleCatch(err);
    }
  };

  const editAsset = async (id, state, callback) => {
    try {
      const resData = await makeReq(`/assets/${id}`, { body: state }, 'PATCH');
      toast.success('Asset Updated Successfully!');
      updateAsset(id, resData.asset);
      callback?.();
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteAsset = async (id) => {
    try {
      await makeReq(`/assets/${id}`, {}, 'DELETE');
      toast.success('Asset Deleted Successfully!');
      removeAsset(id);
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <AssetsContext.Provider
      displayName='Assets Context'
      value={{
        loading,
        assets,
        getAssetById,
        createAsset,
        deleteAsset,
        editAsset,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
