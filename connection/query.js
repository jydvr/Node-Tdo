
const login="select * from user where username=? and password=?;"
const reg="INSERT INTO user(firstname, lastname, email, username, password) VALUES (?,?,?,?,?)"
const createTask = `INSERT INTO tasks(name, description,status, start_date, end_date, effective_start_date) VALUES(?,?,"not started",?,?,CURRENT_DATE())`;
const map_task = `INSERT INTO user_task_mapping(userid, taskid, effective_start_date) VALUES(?,?,CURRENT_DATE())`;
const Exists = "SELECT id FROM tasks WHERE id = ?";
const getPercentageSum = "SELECT SUM(percentage) as sum FROM log WHERE task_id = ?";
const insertLog = "INSERT INTO log (task_id, log_description, effective_start_date, percentage) VALUES (?, ?, ?, ?)";
const updateTaskEndDate = "UPDATE tasks SET effective_end_date = ? WHERE id = ?";
const delTask = "UPDATE tasks SET effective_end_date = ? WHERE id = ?";
const delusertask="UPDATE user_task_mapping SET effective_end_date = ? WHERE taskid = ?";
const displays="SELECT t.*FROM tasks t JOIN user_task_mapping utm ON t.id = utm.taskid WHERE utm.userid = ? AND utm.effective_end_date IS NULL";
const taskCheckQuery = 'SELECT effective_end_date FROM tasks WHERE id = ?';
const edit="UPDATE tasks SET status = 'In Progress' where id=?";
module.exports={ 
    login,
    reg,
    createTask,
    map_task,
    Exists,
    getPercentageSum,
    insertLog,
    updateTaskEndDate,
    delTask,
    delusertask,
    displays, 
    edit
}


// {
//     "task_name":"task3",
//     "task_description":"desc3",
//     "start_date":"2024-04-23",
//     "end_date":"2024-04-25"
//     }
// "firstname":"ABC",
// "lastname":"DE",
// "email":"abc@gmail.com",
// "username":"abcd",
// "password":"123123"   

// "task_id":"86",
//    "log_description":"taskA1",
//    "percentage":"20"