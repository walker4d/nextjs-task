const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs').promises; 
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;
app.use(express.json()); 

app.get('/api', async (req, res) => {
  try{
    const jsonData = await fs.readFile('TaskList.json', 'utf-8');
    const data = JSON.parse(jsonData);
    res.send(data);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error', e});
  }
});

  app.put('/api/update', async (req, res) => {
    try{
        let updatedTask = req.body;

        await fs.writeFile('TaskList.json', JSON.stringify(updatedTask, null, 2), 'utf-8');

        res.json({ success: true });

    }catch(e){
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/api/users',async (req, res) => {
    try {
        const jsonData = await fs.readFile('TaskList.json', 'utf-8'); 
        const tasks = JSON.parse(jsonData);
        
     
        const uniqueAssignees = [...new Set(tasks.map(task => JSON.stringify(task.assignee)))].map(assignee => JSON.parse(assignee));
    
        res.send(uniqueAssignees);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});