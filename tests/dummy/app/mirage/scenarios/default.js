export default function( server ) {

  // Seed your development database using your factories. This
  // data will not be loaded in your tests.

  let manager1 = server.create('manager');
  let subManager1 = server.create('sub-manager', {manager: manager1.id});
  let employee1 = server.create('employee', {subManager: subManager1.id});
  let task1 = server.create('task', {employee: employee1.id});
  let subTask1 = server.createList('sub-task', 3, {task: task1.id});

}
