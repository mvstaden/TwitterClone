import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(`Error getting user profiler: ${error.message}`);
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    //convert id to string as req.user._id is in type of object
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't follow/unfollow yourself" });
    }
    if (!userToFollow || !currentUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      //toDo return the id of the user as a response
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });

      //Send notification to user
      const newNotification = new Notification({
        type: "follow",
        from: currentUser._id,
        to: userToFollow._id,
      });

      await newNotification.save();

      //toDo return the id of the user as a response
      //default
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(`Error following or unfollow user: ${error.message}`);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const usersFollowedByMe = await User.findById(currentUser).select(
      "following"
    );
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: currentUser },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error getting suggested users: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUser = async (req, res) => {
  //Get values we want to update
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  //Get id of current user
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (
      (!newPassword && !currentPassword) ||
      (!currentPassword && !newPassword)
    ) {
      return res.status(400).json({
        message: "Please provide both current password and new password",
      });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  } catch (error) {}
};
