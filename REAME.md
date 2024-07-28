# TickTick JS Library

A JavaScript library for interacting with the TickTick API. This library provides an easy-to-use interface for managing tasks and lists in TickTick.

## Features

- Authenticate with TickTick API using client credentials
- Manage tasks (create, update, delete, complete, uncomplete)
- Manage lists (create, update, delete)
- Search tasks
- List tasks with various filters
- Move tasks between lists

## Installation

Install the package using npm:

```bash
npm install ticktick-js
```

## Configuration

Create a `.env` file in your project root with your TickTick API credentials:

```
TICKTICK_CLIENT_ID=your_client_id_here
TICKTICK_CLIENT_SECRET=your_client_secret_here
```

To obtain these credentials, you need to register your application with TickTick. Visit the TickTick Developer Portal for more information.

## Usage

Here's a basic example of how to use the TickTick JS Library:

```javascript
import TickTick from 'ticktick-js';

const ticktick = new TickTick();

(async () => {
  try {
    // Add a new task
    const newTask = await ticktick.addTask('Buy groceries', 'Milk, eggs, bread', '2024-07-30', 2);
    console.log('New task:', newTask);

    // List incomplete tasks for this month
    const tasks = await ticktick.listTasks('incomplete', '2024-07-01', '2024-07-31');
    console.log('Tasks this month:', tasks);

    // Create a new list
    const newList = await ticktick.createList('Shopping');
    console.log('New list:', newList);

    // Move the task to the new list
    await ticktick.moveTask(newTask.id, newList.id);

    // Complete the task
    await ticktick.completeTask(newTask.id);

    // Search for tasks
    const searchResults = await ticktick.searchTasks('groceries');
    console.log('Search results:', searchResults);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

## API Documentation

### Tasks

#### `addTask(title, content = '', dueDate = null, priority = 0, listId = null)`

Adds a new task.

#### `updateTask(taskId, updates)`

Updates an existing task.

#### `deleteTask(taskId)`

Deletes a task.

#### `getTask(taskId)`

Retrieves a specific task.

#### `listTasks(filter = 'all', startDate = null, endDate = null, listId = null)`

Lists tasks based on specified filters.

#### `completeTask(taskId)`

Marks a task as complete.

#### `uncompleteTask(taskId)`

Marks a task as incomplete.

#### `moveTask(taskId, toListId)`

Moves a task to a different list.

#### `searchTasks(keyword)`

Searches for tasks containing the specified keyword.

### Lists

#### `createList(title)`

Creates a new list.

#### `updateList(listId, updates)`

Updates an existing list.

#### `deleteList(listId)`

Deletes a list.

#### `getLists()`

Retrieves all lists.

## Error Handling

All methods return promises. Use try/catch blocks or .catch() to handle any errors that may occur during API requests.

## Development

To set up the project for development:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with your TickTick API credentials
4. Run tests using `npm test`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.