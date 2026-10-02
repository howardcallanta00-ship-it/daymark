'use strict';

function isoOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const createdAt = new Date('2026-01-15T08:30:00');
const tasks = [
  { id: 1, title: 'Review yesterday’s project notes', status: 'completed', taskDate: isoOffset(-1), createdAt },
  { id: 2, title: 'Send the weekly progress summary', status: 'completed', taskDate: isoOffset(-1), createdAt },
  { id: 3, title: 'Plan the top priorities for today', status: 'completed', taskDate: isoOffset(0), createdAt },
  { id: 4, title: 'Finish the dashboard wireframes', status: 'in-progress', taskDate: isoOffset(0), createdAt },
  { id: 5, title: 'Meet with the product team', status: 'pending', taskDate: isoOffset(0), createdAt },
  { id: 6, title: 'Prepare tomorrow’s handoff notes', status: 'pending', taskDate: isoOffset(0), createdAt },
  { id: 7, title: 'Review customer feedback', status: 'pending', taskDate: isoOffset(1), createdAt },
  { id: 8, title: 'Outline the next sprint', status: 'pending', taskDate: isoOffset(1), createdAt }
];

module.exports = {
  taskModel: {
    async findForToday() {
      return tasks.filter((task) => task.taskDate === isoOffset(0));
    },
    async findAll() {
      return [...tasks].sort((a, b) => a.taskDate.localeCompare(b.taskDate));
    }
  },
  userModel: {
    async findDemoUser() {
      return {
        id: 1,
        username: 'alex.morgan',
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        createdAt
      };
    }
  }
};
