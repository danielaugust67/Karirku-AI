export const getChats = () => {
    const stored = localStorage.getItem("careerChats");
    return stored ? JSON.parse(stored) : [];
  };
  
  export const saveChats = (chats: any[]) => {
    localStorage.setItem("careerChats", JSON.stringify(chats));
  };
  
  export const generateId = () => {
    return crypto.randomUUID();
  };
  