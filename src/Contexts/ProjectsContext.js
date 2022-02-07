import { useArray } from 'src/hooks';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { makeReq, handleCatch } from 'src/utils/makeReq';
import { AuthContext } from './AuthContext';

export const ProjectsContext = React.createContext();

export const ProjectsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [
    projects,
    setProjects,
    pushProject,
    filterProject,
    updateProject,
    removeProject,
    clearProjects,
  ] = useArray([], '_id');

  const fetchProjects = async () => {
    try {
      const resData = await makeReq(`/projects`);
      console.log('PROJECTS', resData);
      setProjects(resData.projects);
    } catch (err) {
      handleCatch(err);
    } finally {
      setLoading(false);
    }
  };

  const getProjectById = (id) => {
    return projects.find((el) => el._id === id);
  };

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  // * CRUD Operations
  const createProject = async (state, callback) => {
    try {
      console.log('state', state);

      const resData = await makeReq(
        `/projects`,
        { body: state },
        'POST'
      );
      toast.success('Project Created Successfully!');
      pushProject(resData.project);
      callback?.();
    } catch (err) {
      handleCatch(err);
    }
  };

  const editProject = async (id, state, callback) => {
    try {
      const resData = await makeReq(
        `/projects/${id}`,
        { body: state },
        'PATCH'
      );
      toast.success('Project Updated Successfully!');
      updateProject(id, resData.project);
      callback?.();
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await makeReq(`/projects/${id}`, {}, 'DELETE');
      toast.success('Project Deleted Successfully!');
      removeProject(id);
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <ProjectsContext.Provider
      displayName='Projects Context'
      value={{
        loading,
        projects,
        getProjectById,
        createProject,
        deleteProject,
        editProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
