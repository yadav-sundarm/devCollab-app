import User from "../models/User.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const githubAuth = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,user:email`;
  res.redirect(url);
};

export const githubCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );
    const accessToken = tokenRes.data.access_token;

    const { data: githubUser } = await axios.get(
      "https://api.github.com/user",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    let email = githubUser.email;
    if (!email) {
      const { data: emails } = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || null;
    }

    let user = await User.findOne({ githubId: String(githubUser.id) });
    if (!user) {
      user = await User.create({
        githubId: String(githubUser.id),
        userName: githubUser.login,
        email,
        avatar: githubUser.avatar_url,
        githubLink: githubUser.html_url,
        skills: [],
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        githubLink: user.githubLink,
        skills: user.skills,
        isProfileComplete: user.isProfileComplete,
      }),
    );

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userData}`,
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=github_failed`);
  }
};
