-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),

('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),

('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png');


-- ========================================
-- Service Project Table
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,

    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);


-- ========================================
-- Insert sample data: Service Projects
-- ========================================

INSERT INTO service_project
    (organization_id, title, description, location, date)
VALUES

-- BrightFuture Builders
(1, 'Community Center Renovation',
 'Renovate and improve a local community center for neighborhood activities.',
 'Community Center',
 '2026-09-20'),

(1, 'Neighborhood Playground Repair',
 'Repair playground equipment and improve the surrounding recreational area.',
 'Central Park',
 '2026-09-27'),

(1, 'Accessible Community Garden',
 'Build accessible paths and garden spaces for residents of the community.',
 'Community Garden',
 '2026-10-04'),

(1, 'Public Library Improvement',
 'Help improve and organize spaces in the local public library.',
 'Public Library',
 '2026-10-11'),

(1, 'Community Building Cleanup',
 'Clean and restore a community building used for local activities.',
 'Community Activity Hall',
 '2026-10-18'),


-- GreenHarvest Growers
(2, 'Urban Garden Planting',
 'Plant vegetables and herbs in a community urban garden.',
 'Green Neighborhood Garden',
 '2026-09-21'),

(2, 'Food Sustainability Workshop',
 'Teach community members about sustainable food production and gardening.',
 'Community Center',
 '2026-09-28'),

(2, 'Community Vegetable Harvest',
 'Harvest vegetables grown in the community garden and prepare them for distribution.',
 'Green Neighborhood Garden',
 '2026-10-05'),

(2, 'School Garden Project',
 'Create a small educational garden for students to learn about growing food.',
 'School Garden',
 '2026-10-12'),

(2, 'Neighborhood Tree Planting',
 'Plant trees and other useful plants to improve the local environment.',
 'North Neighborhood',
 '2026-10-19'),


-- UnityServe Volunteers
(3, 'Food Donation Drive',
 'Collect and organize food donations for families in need.',
 'Community Food Center',
 '2026-09-22'),

(3, 'Senior Center Assistance',
 'Assist staff and residents with activities and organization at a senior center.',
 'Senior Center',
 '2026-09-29'),

(3, 'Clothing Donation Event',
 'Collect, organize, and distribute donated clothing to local families.',
 'Community Hall',
 '2026-10-06'),

(3, 'Neighborhood Cleanup',
 'Volunteers work together to clean public spaces and remove litter.',
 'South Neighborhood',
 '2026-10-13'),

(3, 'Community Charity Event',
 'Support a community charity event through volunteer activities and organization.',
 'Community Center',
 '2026-10-20');
 
 -- ========================================
-- Category Table
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- Service Project Category Table
-- ========================================

CREATE TABLE service_project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id),

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);


-- ========================================
-- Insert sample data: Categories
-- ========================================

INSERT INTO category (name)
VALUES
('Environmental'),
('Education'),
('Community Support'),
('Food and Sustainability'),
('Donations');


-- ========================================
-- Associate Service Projects with Categories
-- ========================================

INSERT INTO service_project_category (project_id, category_id)
VALUES
(1, 3),
(2, 3),
(3, 1),
(4, 2),
(5, 3),
(6, 4),
(7, 4),
(8, 4),
(9, 2),
(10, 1),
(11, 5),
(12, 3),
(13, 5),
(14, 1),
(15, 3);