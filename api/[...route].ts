import app from "../backend/src/app";

export default function handler(req, res) {
  return app(req, res);
}