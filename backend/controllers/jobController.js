// jobController.js
const pool = require("../config/db");

// Mendapatkan semua pekerjaan
const getAllJobs = async (req, res) => {
  try {
    const [jobs] = await pool.execute("SELECT * FROM jobs");
    
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];

      const [skills] = await pool.execute("SELECT * FROM job_skills WHERE job_id=?", [job.id]);
      job.skills = skills;

      const [tags] = await pool.execute("SELECT * FROM job_tags WHERE job_id=?", [job.id]);
      job.tags = tags;

      const [responsibilities] = await pool.execute("SELECT * FROM job_responsibilities WHERE job_id=?", [job.id]);
      job.responsibilities = responsibilities;

      const [qualifications] = await pool.execute("SELECT * FROM job_qualifications WHERE job_id=?", [job.id]);
      job.qualifications = qualifications;
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Mendapatkan detail pekerjaan berdasarkan ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const [job] = await pool.execute("SELECT * FROM jobs WHERE id = ?", [id]);

    if (!job.length) {
      return res.status(404).json({ error: "Job not found" });
    }

    const [skills] = await pool.execute("SELECT * FROM job_skills WHERE job_id=?", [job[0].id]);
    const [tags] = await pool.execute("SELECT * FROM job_tags WHERE job_id=?", [job[0].id]);
    const [responsibilities] = await pool.execute("SELECT * FROM job_responsibilities WHERE job_id=?", [job[0].id]);
    const [qualifications] = await pool.execute("SELECT * FROM job_qualifications WHERE job_id=?", [job[0].id]);

    job[0].skills = skills;
    job[0].tags = tags;
    job[0].responsibilities = responsibilities;
    job[0].qualifications = qualifications;

    res.status(200).json(job[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Menambahkan pekerjaan baru
const addJob = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { title, type, salary, education, job_level, work_schedule, skills, responsibilities, qualifications, tags } = req.body;
    
    if (!title || !type || !salary || !education || !job_level || !work_schedule) {
        return res.status(400).json({ error: "Data tidak lengkap" });
      }

    const [jobResult] = await connection.execute(
      `INSERT INTO jobs (title, type, salary, education, job_level, work_schedule) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, type, salary, education, job_level, work_schedule]
    );
    const jobId = jobResult.insertId;

    // Insert ke tabel terkait: job_skills, job_tags, job_responsibilities, job_qualifications
    const insertSkills = skills.map(skill => [skill, jobId]);
    const insertResponsibilities = responsibilities.map(responsibility => [responsibility, jobId]);
    const insertQualifications = qualifications.map(qualification => [qualification, jobId]);
    const insertTags = tags.map(tag => [tag, jobId]);

    await connection.query(`INSERT INTO job_skills (skill, job_id) VALUES ?`, [insertSkills]);
    await connection.query(`INSERT INTO job_responsibilities (responsibility, job_id) VALUES ?`, [insertResponsibilities]);
    await connection.query(`INSERT INTO job_qualifications (qualification, job_id) VALUES ?`, [insertQualifications]);
    await connection.query(`INSERT INTO job_tags (tag, job_id) VALUES ?`, [insertTags]);

    await connection.commit();
    res.status(201).json({ message: "Job successfully posted", jobId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menambahkan pekerjaan." });
  } finally {
    connection.release();
  }
};

// Mengupdate pekerjaan
const updateJob = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { title, type, salary, education, job_level, work_schedule, skills, responsibilities, qualifications, tags } = req.body;

    // Update pekerjaan utama
    const [updateResult] = await connection.execute(
      `UPDATE jobs SET title = ?, type = ?, salary = ?, education = ?, job_level = ?, work_schedule = ? WHERE id = ?`,
      [title, type, salary, education, job_level, work_schedule, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found or not updated" });
    }

    // Hapus data lama dan masukkan yang baru
    await connection.execute("DELETE FROM job_skills WHERE job_id = ?", [id]);
    await connection.execute("DELETE FROM job_responsibilities WHERE job_id = ?", [id]);
    await connection.execute("DELETE FROM job_qualifications WHERE job_id = ?", [id]);
    await connection.execute("DELETE FROM job_tags WHERE job_id = ?", [id]);

    const insertSkills = skills.map(skill => [skill, id]);
    const insertResponsibilities = responsibilities.map(responsibility => [responsibility, id]);
    const insertQualifications = qualifications.map(qualification => [qualification, id]);
    const insertTags = tags.map(tag => [tag, id]);

    await connection.query(`INSERT INTO job_skills (skill, job_id) VALUES ?`, [insertSkills]);
    await connection.query(`INSERT INTO job_responsibilities (responsibility, job_id) VALUES ?`, [insertResponsibilities]);
    await connection.query(`INSERT INTO job_qualifications (qualification, job_id) VALUES ?`, [insertQualifications]);
    await connection.query(`INSERT INTO job_tags (tag, job_id) VALUES ?`, [insertTags]);

    await connection.commit();
    res.status(200).json({ message: "Job successfully updated" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengupdate pekerjaan." });
  } finally {
    connection.release();
  }
};

// Menghapus pekerjaan
const deleteJob = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const [deleteResult] = await connection.execute("DELETE FROM jobs WHERE id = ?", [id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found or already deleted" });
    }

    await connection.commit();
    res.status(200).json({ message: "Job successfully deleted" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus pekerjaan." });
  } finally {
    connection.release();
  }
};

module.exports = { getAllJobs, getJobById, addJob, updateJob, deleteJob };