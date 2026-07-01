-- Migration: Add new employee fields
-- Date: 2026-06-30
-- Description: Add employee_number, branch, department, join_date, pnfl, email, salary_type, salary_amount, status, kpi_template to employees table

ALTER TABLE employees
ADD COLUMN IF NOT EXISTS employee_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS branch VARCHAR(100),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS position VARCHAR(100),
ADD COLUMN IF NOT EXISTS join_date DATE,
ADD COLUMN IF NOT EXISTS pnfl VARCHAR(14),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS salary_type VARCHAR(50) DEFAULT 'Oylik',
ADD COLUMN IF NOT EXISTS salary_amount DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Faol',
ADD COLUMN IF NOT EXISTS kpi_template VARCHAR(100);

-- Create index on employee_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
