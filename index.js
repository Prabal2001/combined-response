const express = require("express");
const fs = require("fs/promises");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;

const postUrl = "https://jsonplaceholder.typicode.com/posts";
const userUrl = "https://jsonplaceholder.typicode.com/users";

const fetchUsersandPosts = async () => {
  try {
    const [postResponse, userResponse] = await Promise.all([
      axios.get(postUrl),
      axios.get(userUrl),
    ]);
    await fs.writeFile("posts.json", JSON.stringify(postResponse.data));
    await fs.writeFile("users.json", JSON.stringify(userResponse.data));
  } catch (error) {
    console.log(error);
  }
};
const getUsersandPosts = async () => {
  try {
    const [postsData, userData] = await Promise.all([
      fs.readFile("posts.json", "utf8"),
      fs.readFile("users.json", "utf8"),
    ]);
    const posts = JSON.parse(postsData);
    const users = JSON.parse(userData);

    const usersPosts = posts.map((post) => {
      const user = users.find((user) => user.id === post.userId).name;
      return {
        ...post,
        user,
      };
    });
    return usersPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// fetchUsersandPosts();

app.get("/posts", async (req, res) => {
  const usersPosts = await getUsersandPosts();
  res.send(usersPosts);
});
app.listen(PORT, () => {
  console.log(`The server running on ${PORT}`);
});
