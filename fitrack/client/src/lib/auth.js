export const saveUserId = (id) => localStorage.setItem("fitrack_user_id", id);
export const getUserId = () => localStorage.getItem("fitrack_user_id");
export const clearUserId = () => localStorage.removeItem("fitrack_user_id");
