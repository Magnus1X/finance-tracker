const { prisma } = require('../config/database');

/**
 * @desc    Get all goals
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res, next) => {
  try {
    const { title, target, deadline, icon } = req.body;

    if (!title || !target || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, target, and deadline',
      });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title,
        target: parseFloat(target),
        deadline,
        icon: icon || '🎯',
      },
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await prisma.goal.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    await prisma.goal.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  createGoal,
  deleteGoal,
};
