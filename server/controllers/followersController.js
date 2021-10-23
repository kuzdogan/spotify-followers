const { getFollowersFromUserId } = require("../utils/spotify");
const {
  checkUser,
  checkFollowerDifference,
  updateFollowersOfUser,
} = require("../utils/user");

// POST /user/:userId/follower-diff
exports.getFollowersUnfollowers = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).send("Bad Request");
  const user = await checkUser(userId);

  if (user) {
    console.log(`User ${user.id} exists`);
    const [newFollowers, unfollowers] = await checkFollowerDifference(user.id);
    console.log("New followers are: ", newFollowers);
    console.log("Unfollowers are: ", unfollowers);
    await updateFollowersOfUser(newFollowers, unfollowers, user);
    return res.status(200).json({ newFollowers, unfollowers });
  } else {
    console.log(`User does not exist. Creating user ${userId}`);
    const newUser = await createUser(userId);
    console.log("Successfully created user " + newUser.id);
    res.status(201).json({
      user: user,
      message: `Wohooo! User ${user.id} has been created.`,
    });
  }
};

// GET /user/:userId/current-followers
exports.getCurrentFollowers = function (req, res) {
  const userId = req.params.userId;
  console.log("Get followers called for user " + userId);
  if (!userId) return res.status(400).send("Bad Request");
  return getFollowersFromUserId(userId).then((followers) => {
    res.status(200).json({ followers: followers });
  });
};
