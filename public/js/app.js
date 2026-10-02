'use strict';

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.classList.toggle('open', !isOpen);
  });

  primaryNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
    }
  });
}

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const taskSearch = document.querySelector('[data-task-search]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const taskCards = [...document.querySelectorAll('[data-task]')];
const dateGroups = [...document.querySelectorAll('[data-date-group]')];
const filterResult = document.querySelector('[data-filter-result]');
const filterEmpty = document.querySelector('[data-filter-empty]');

if (taskSearch && taskCards.length) {
  let activeFilter = 'all';

  const updateTaskList = () => {
    const query = taskSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    taskCards.forEach((card) => {
      const matchesSearch = card.dataset.title.includes(query);
      const matchesStatus = activeFilter === 'all' || card.dataset.status === activeFilter;
      const isVisible = matchesSearch && matchesStatus;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    dateGroups.forEach((group) => {
      group.hidden = !group.querySelector('[data-task]:not([hidden])');
    });

    filterResult.textContent = `${visibleCount} ${visibleCount === 1 ? 'task' : 'tasks'} shown`;
    filterEmpty.hidden = visibleCount !== 0;
  };

  taskSearch.addEventListener('input', updateTaskList);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      updateTaskList();
    });
  });
}
