import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../utils/api';

const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/goals');
      if (data.success) {
        setGoals(data.data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGoalProgress = useCallback(async (goalId, progress) => {
    try {
      const { data } = await api.put(`/api/goals/${goalId}/progress`, { progress });
      if (data.success) {
        setGoals(prevGoals => 
          prevGoals.map(goal => 
            goal._id === goalId ? { ...goal, progress } : goal
          )
        );
        return data.data;
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }, []);

  const deleteGoal = useCallback(async (goalId) => {
    try {
      const { data } = await api.delete(`/api/goals/${goalId}`);
      if (data.success) {
        setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
        return data.data;
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }, []);

  return (
    <GoalContext.Provider value={{ goals, loading, fetchGoals, updateGoalProgress, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
