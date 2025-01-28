-- Common table for all types of registrations
CREATE TABLE registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL, -- 'summit', 'call_for_paper', 'hackathon'
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    telegram_id VARCHAR(100),
    organization VARCHAR(255),
    designation VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Call for Paper specific fields
CREATE TABLE paper_submissions (
    registration_id UUID PRIMARY KEY REFERENCES registrations(id),
    amount DECIMAL(10,2) DEFAULT 5000.00
);

-- Hackathon specific fields
CREATE TABLE hackathon_details (
    registration_id UUID PRIMARY KEY REFERENCES registrations(id),
    github_profile VARCHAR(255) NOT NULL,
    linkedin_profile VARCHAR(255),
    experience_years VARCHAR(20) NOT NULL,
    osint_skills TEXT NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    team_size INTEGER NOT NULL,
    team_role VARCHAR(100) NOT NULL,
    project_idea TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_form_type ON registrations(form_type);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_status ON registrations(status);
