'use strict';

const APP_TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Manila';

function toLocalDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`);
  }
  return new Date(value);
}

function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options
  }).format(toLocalDate(value));
}

function statusLabel(status) {
  return status.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function groupTasksByDate(tasks) {
  return tasks.reduce((groups, task) => {
    const key = String(task.taskDate).slice(0, 10);
    const existing = groups.find((group) => group.key === key);

    if (existing) {
      existing.tasks.push(task);
    } else {
      groups.push({ key, label: formatDate(task.taskDate), tasks: [task] });
    }

    return groups;
  }, []);
}

function createPageController({ taskModel, userModel }) {
  return {
    async welcome(request, response) {
      const tasks = await taskModel.findForToday();
      const completedCount = tasks.filter((task) => task.status === 'completed').length;
      const inProgressCount = tasks.filter((task) => task.status === 'in-progress').length;

      response.render('welcome', {
        pageTitle: 'Today',
        activePath: '/',
        tasks,
        completedCount,
        inProgressCount,
        progressPercent: tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0,
        todayLabel: formatDate(new Date(), { weekday: 'long' }),
        formatDate,
        statusLabel
      });
    },

    async tasks(request, response) {
      const tasks = await taskModel.findAll();
      response.render('tasks', {
        pageTitle: 'All tasks',
        activePath: '/tasks',
        tasks,
        groupedTasks: groupTasksByDate(tasks),
        completedCount: tasks.filter((task) => task.status === 'completed').length,
        pendingCount: tasks.filter((task) => task.status === 'pending').length,
        formatDate,
        statusLabel
      });
    },

    async profile(request, response) {
      const user = await userModel.findDemoUser();
      if (!user) {
        return response.status(404).render('error', {
          pageTitle: 'Profile unavailable',
          activePath: '/profile',
          statusCode: 404,
          message: 'No demo user has been added yet.'
        });
      }

      response.render('profile', {
        pageTitle: 'Profile',
        activePath: '/profile',
        user,
        memberSince: formatDate(user.createdAt),
        initials: user.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()
      });
    },

    about(request, response) {
      response.render('about', {
        pageTitle: 'About',
        activePath: '/about'
      });
    }
  };
}

module.exports = createPageController;
module.exports.formatDate = formatDate;
module.exports.groupTasksByDate = groupTasksByDate;
