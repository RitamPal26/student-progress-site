// utils/codeforcesAPI.js
const fetchUserInfo = async (handle) => {
  const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
  return response.data.result[0];
};

const fetchUserSubmissions = async (handle) => {
  const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
  return response.data.result;
};
