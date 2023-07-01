var g_users = [];

// joins the user to the specific chatroom
function join_Group_User(id, username, room) {
  let n_user = { id, username, room };
 
  g_users.push(n_user);
  console.log(g_users, "users");
  console.log(n_user," : p_users");

  return n_user;
}

console.log("user out", g_users);

// Gets a particular user id to return the current user
 function get_Current_Group_User(id,room) {
  console.log("user id = ",id);
  console.log("user roomname = ",id);
  console.log();
  let result =  (g_users.find((n_user) => n_user.id == id && n_user.room == room))
  console.log("result for find by id = ",result);
  return result
}
module.exports = {
    join_Group_User,
    get_Current_Group_User,
  };