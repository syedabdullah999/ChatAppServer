var c_users = [];

// joins the user to the specific chatroom
function join_User(id, username, room) {
  let p_user = { id, username, room };

  c_users.push(p_user);
  console.log(c_users, "users");
  console.log(p_user," : p_users");

  return p_user;
}

console.log("user out", c_users);

// Gets a particular user id to return the current user
async function get_Current_User(id) {
  console.log("user id = ",id);
  console.log();
  let result = await (c_users.find((p_user) => p_user.id == id))
  console.log("result for find by id = ",result);
  return result
}

function get_All_User(){
  let result = c_users
  return result
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);
  console.log("users left : ",c_users);
  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  get_All_User,
};
