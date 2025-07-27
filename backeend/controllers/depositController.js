const depositCheck = async (req, res) => {
    try {
        const { user } = req.body;
        const userWallet = req.user.Wallet;  // Access the user object attached by middleware
        const usercoin = req.user.coin; 
        const walletBalance = parseInt(userWallet); // Convert wallet to integer
         const coin = parseInt(usercoin);
        console.log("User balance:", walletBalance);
         //console.log("User balance:", usercoin);
        return res.json({ balance: walletBalance,coin:coin });
    } catch (error) {
        console.error("Error in depositCheck:", error);
        return res.status(500).json({ message: "Error checking deposit" });
    }
};

module.exports = { depositCheck };
