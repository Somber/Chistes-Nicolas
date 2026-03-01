function getTest(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Backend funcionando 🚀',
    timestamp: new Date().toISOString()
  });
}

module.exports = { getTest };
