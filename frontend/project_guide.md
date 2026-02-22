🧪 Unit Testing

PART 1 — UNIT TESTING (Frontend)
Library Choice: Vitest + React Testing Library
Why Vitest?

Built specifically for Vite projects — zero config needed
Same API as Jest, so knowledge transfers
Runs in milliseconds (much faster than Jest)
Works natively with ES modules

Why React Testing Library (RTL)?

Tests components the way users interact with them — not implementation details
Industry standard for React component testing
Works perfectly with Vitest

Installation Commands
bash# Inside /frontend directory
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

Config Changes
vite.config.js — Add test block
javascriptimport { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
plugins: [react()],
test: {
globals: true, // No need to import describe/it/expect in every file
environment: 'jsdom', // Simulates browser DOM
setupFiles: './src/test/setup.js',
css: false, // Skip CSS processing in tests (faster)
},
});

src/test/setup.js — Global test setup
javascriptimport '@testing-library/jest-dom';
// This gives you matchers like: toBeInTheDocument(), toHaveValue(), toBeDisabled()

Test Folder Structure
frontend/
└── src/
├── test/
│ └── setup.js # Global setup (import jest-dom)
│
├── components/
│ ├── tasks/
│ │ ├── TaskCard.jsx
│ │ ├── **tests**/
│ │ │ ├── TaskCard.test.jsx # Test TaskCard rendering
│ │ │ └── TaskFilters.test.jsx # Test filter interactions
│ │
│ ├── statuses/
│ │ ├── **tests**/
│ │ │ └── StatusManager.test.jsx # Test status CRUD UI
│ │
│ └── ui/
│ ├── **tests**/
│ │ └── ComboboxCreatable.test.jsx # Test combobox logic
│
└── hooks/
└── **tests**/
└── useTasks.test.js # Test query hook behavior

Rule: Test files live in a **tests** folder right next to the component they test. File name mirrors the component: TaskCard.jsx → TaskCard.test.jsx

NPM Scripts to Add in package.json
json"scripts": {
"dev": "vite",
"build": "vite build",
"test": "vitest",
"test:ui": "vitest --ui",
"test:run": "vitest run",
"coverage": "vitest run --coverage"
}
CommandWhat It Doesnpm testWatch mode — reruns on file changenpm run test:runSingle run — for CI pipelinesnpm run test:uiOpens beautiful browser UI for testsnpm run coverageGenerates coverage report

What to Test (Exact Files + What Each Test Covers)

Test 1: TaskCard.test.jsx
jsximport { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../TaskCard';

// Mock task data
const mockTask = {
\_id: '64f1a2b3c4d5e6f7a8b9c0d2',
title: 'Fix login bug',
description: 'Users cannot log in with Google OAuth',
status: 'In Review',
priority: 'High',
dueDate: '2099-12-01T00:00:00.000Z', // Future date — not overdue
createdAt: '2024-01-15T10:30:00.000Z',
};

const mockOverdueTask = {
...mockTask,
dueDate: '2020-01-01T00:00:00.000Z', // Past date — overdue
};

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

describe('TaskCard', () => {
it('renders task title and description', () => {
render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
expect(screen.getByText('Fix login bug')).toBeInTheDocument();
expect(screen.getByText('Users cannot log in with Google OAuth')).toBeInTheDocument();
});

it('renders status and priority badges', () => {
render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
expect(screen.getByText('In Review')).toBeInTheDocument();
expect(screen.getByText('High')).toBeInTheDocument();
});

it('calls onEdit when edit button is clicked', async () => {
const user = userEvent.setup();
render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
await user.click(screen.getByRole('button', { name: /edit/i }));
expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
});

it('calls onDelete when delete button is clicked', async () => {
const user = userEvent.setup();
render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
await user.click(screen.getByRole('button', { name: /delete/i }));
expect(mockOnDelete).toHaveBeenCalledWith(mockTask.\_id);
});

it('shows overdue indicator when due date is in the past', () => {
render(<TaskCard task={mockOverdueTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
const dueDateEl = screen.getByTestId('due-date');
expect(dueDateEl).toHaveClass('text-red-500'); // Adjust class to match yours
});

it('disables action buttons when isLoading is true', () => {
render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} isLoading={true} />);
expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
});
});

Test 2: TaskFilters.test.jsx
jsximport { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFilters from '../TaskFilters';

const mockStatuses = [{ name: 'Todo', color: '#6B7280' }, { name: 'In Review', color: '#3B82F6' }];
const mockPriorities = [{ name: 'High', color: '#EF4444' }, { name: 'Low', color: '#10B981' }];
const mockOnFilterChange = vi.fn();

describe('TaskFilters', () => {
beforeEach(() => {
vi.clearAllMocks();
});

it('renders search input', () => {
render(<TaskFilters statuses={mockStatuses} priorities={mockPriorities} onFilterChange={mockOnFilterChange} />);
expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
});

it('calls onFilterChange after typing in search (debounced)', async () => {
const user = userEvent.setup();
render(<TaskFilters statuses={mockStatuses} priorities={mockPriorities} onFilterChange={mockOnFilterChange} />);

    await user.type(screen.getByPlaceholderText(/search/i), 'bug');

    // Wait for debounce (300ms)
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'bug' }));
    }, { timeout: 500 });

});

it('renders status filter pills', () => {
render(<TaskFilters statuses={mockStatuses} priorities={mockPriorities} onFilterChange={mockOnFilterChange} />);
expect(screen.getByText('Todo')).toBeInTheDocument();
expect(screen.getByText('In Review')).toBeInTheDocument();
});

it('calls onFilterChange when status pill is clicked', async () => {
const user = userEvent.setup();
render(<TaskFilters statuses={mockStatuses} priorities={mockPriorities} onFilterChange={mockOnFilterChange} />);
await user.click(screen.getByText('Todo'));
expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'Todo' }));
});

it('shows clear filters button when a filter is active', async () => {
render(<TaskFilters statuses={mockStatuses} priorities={mockPriorities} onFilterChange={mockOnFilterChange} selectedStatus="Todo" />);
expect(screen.getByText(/clear/i)).toBeInTheDocument();
});
});

Test 3: ComboboxCreatable.test.jsx
jsximport { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComboboxCreatable from '../ComboboxCreatable';

const mockOptions = [
{ name: 'Todo', color: '#6B7280' },
{ name: 'In Review', color: '#3B82F6' },
];

describe('ComboboxCreatable', () => {
it('renders placeholder when no value selected', () => {
render(<ComboboxCreatable value="" onChange={vi.fn()} options={mockOptions} placeholder="Select status" onCreateNew={vi.fn()} />);
expect(screen.getByText('Select status')).toBeInTheDocument();
});

it('shows options when opened', async () => {
const user = userEvent.setup();
render(<ComboboxCreatable value="" onChange={vi.fn()} options={mockOptions} placeholder="Select status" onCreateNew={vi.fn()} />);
await user.click(screen.getByText('Select status'));
expect(screen.getByText('Todo')).toBeInTheDocument();
expect(screen.getByText('In Review')).toBeInTheDocument();
});

it('shows "Create X" option when typed value does not match any option', async () => {
const user = userEvent.setup();
render(<ComboboxCreatable value="" onChange={vi.fn()} options={mockOptions} placeholder="Select status" onCreateNew={vi.fn()} />);
await user.click(screen.getByText('Select status'));
await user.type(screen.getByRole('combobox'), 'Sprint');
expect(screen.getByText(/create "Sprint"/i)).toBeInTheDocument();
});

it('does NOT show "Create" option when typed value matches existing', async () => {
const user = userEvent.setup();
render(<ComboboxCreatable value="" onChange={vi.fn()} options={mockOptions} placeholder="Select status" onCreateNew={vi.fn()} />);
await user.click(screen.getByText('Select status'));
await user.type(screen.getByRole('combobox'), 'Todo');
expect(screen.queryByText(/create "Todo"/i)).not.toBeInTheDocument();
});

it('calls onCreateNew when Create option is clicked', async () => {
const mockOnCreateNew = vi.fn();
const user = userEvent.setup();
render(<ComboboxCreatable value="" onChange={vi.fn()} options={mockOptions} placeholder="Select status" onCreateNew={mockOnCreateNew} />);
await user.click(screen.getByText('Select status'));
await user.type(screen.getByRole('combobox'), 'Sprint');
await user.click(screen.getByText(/create "Sprint"/i));
expect(mockOnCreateNew).toHaveBeenCalledWith('Sprint');
});
});
