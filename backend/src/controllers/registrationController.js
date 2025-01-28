// src/controllers/registrationController.js
import pool from '../config/db.js';

export const registrationController = {
  // Create new registration
  async create(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const {
        formType,
        firstName,
        middleName,
        lastName,
        email,
        telephone,
        whatsapp,
        telegram,
        organization,
        designation,
        // Hackathon specific fields
        githubProfile,
        linkedinProfile,
        experience,
        skills,
        teamName,
        teamSize,
        teamRole,
        projectIdea,
        // Paper specific fields
        amount
      } = req.body;

      // Insert into main registrations table
      const registrationResult = await client.query(
        `INSERT INTO registrations 
         (form_type, first_name, middle_name, last_name, email, telephone, 
          whatsapp, telegram_id, organization, designation)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [formType, firstName, middleName, lastName, email, telephone,
          whatsapp, telegram, organization, designation]
      );

      const registrationId = registrationResult.rows[0].id;

      // Handle form-specific data
      switch (formType) {
        case 'call_for_paper':
          await client.query(
            `INSERT INTO paper_submissions (registration_id, amount)
             VALUES ($1, $2)`,
            [registrationId, amount || 5000.00]
          );
          break;

        case 'hackathon':
          await client.query(
            `INSERT INTO hackathon_details 
             (registration_id, github_profile, linkedin_profile, experience_years,
              osint_skills, team_name, team_size, team_role, project_idea)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [registrationId, githubProfile, linkedinProfile, experience,
              skills, teamName, teamSize, teamRole, projectIdea]
          );
          break;

        case 'summit':
          // No additional data needed for summit
          break;

        default:
          throw new Error('Invalid form type');
      }

      await client.query('COMMIT');
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        id: registrationId,
        redirectUrl: "https://pages.razorpay.com/upsifs-cyberveda"
      });

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Registration error:', err);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    } finally {
      client.release();
    }
  },

  // Get all registrations with type-specific data
  async getAll(req, res) {
    try {
      const { formType, status, startDate, endDate } = req.query;
      let query = '';

      switch (formType) {
        case 'call_for_paper':
          query = `
            SELECT r.*, p.amount
            FROM registrations r
            LEFT JOIN paper_submissions p ON r.id = p.registration_id
            WHERE r.form_type = 'call_for_paper'
          `;
          break;

        case 'hackathon':
          query = `
            SELECT r.*, h.*
            FROM registrations r
            LEFT JOIN hackathon_details h ON r.id = h.registration_id
            WHERE r.form_type = 'hackathon'
          `;
          break;

        case 'summit':
          query = `
            SELECT *
            FROM registrations
            WHERE form_type = 'summit'
          `;
          break;

        default:
          query = 'SELECT * FROM registrations';
      }

      // Add date filters if provided
      if (startDate) {
        query += ` AND created_at >= '${startDate}'`;
      }
      if (endDate) {
        query += ` AND created_at <= '${endDate}'`;
      }
      if (status) {
        query += ` AND status = '${status}'`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query);
      res.json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      console.error('Error fetching registrations:', err);
      res.status(500).json({
        success: false,
        error: 'Error fetching registrations'
      });
    }
  }
};