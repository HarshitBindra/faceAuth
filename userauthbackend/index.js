const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer =require("multer")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const path = require("path")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/userRegistrationDetails');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    profileImage:String,
    otp: {
        code: String, // The hashed OTP
        expiry: Date // Expiry time of the OTP
    }
})
const User = new mongoose.model("User",userSchema)
//Routes

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      // Define the filename for the uploaded file
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Multer file upload instance
  const upload = multer({ storage: storage });

// Function to generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendOTP(email, otp) {
    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com', // Your Gmail email address
            pass: 'your-password' // Your Gmail password
        }
    });

    // Email content
    let mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: email, // Receiver address
        subject: 'Password Reset OTP', // Subject line
        text: `Your OTP for password reset is: ${otp}` // Plain text body
    };

    // Send email
    await transporter.sendMail(mailOptions);
}

// Route to generate and store OTP
app.post("/generate-otp", async (req, res) => {
    const { email } = req.body;

    // Generate a random 6-digit OTP
    const otp = generateOTP();

    // Hash the OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Set expiry time for the OTP (e.g., 5 minutes from now)
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5); // Set expiry time to 5 minutes from now

    try {
        // Store the hashed OTP and its expiry time in the database
        await User.updateOne({ email }, { otp: { code: hashedOTP, expiry } });

        // Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to your email', otp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to verify OTP
app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve the hashed OTP and its expiry time from the database
        const user = await User.findOne({ email });

        if (!user || !user.otp || !user.otp.code || !user.otp.expiry) {
            return res.status(400).json({ message: 'No OTP found for this user' });
        }

        // Check if the OTP has expired
        if (new Date() > new Date(user.otp.expiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Compare the entered OTP with the stored hashed OTP
        const isOTPValid = await bcrypt.compare(otp, user.otp.code);

        if (isOTPValid) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// submit register page
app.post("/register", (req, res) => {
    console.log("Received registration request");
    const { name, email, password } = req.body;

    // Check if the email already exists in the database
    User.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                console.log("User with this email already exists, please sign in");
                // If the user with the given email already exists
                return res.status(400).json({ message: 'User with this email already exists, please sign in' });
            } else {
                // If the email is unique
                return res.status(200).json({
                                message: "User registered successfully",
                                status: true
                            });
            }
        })
});

// submit data after image authentication
app.post("/image-auth", upload.single('profileImage'), async(req, res) => {
    console.log("Incoming request body:", req.body);
    console.log("Incoming file:", req.file);
  const { name, email, password } = req.body;
  const profileImage = req.file.path; // Path to the uploaded profile image

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    profileImage: profileImage // Store the path to the image in the database
  });

  user.save()
    .then(savedUser => {
      if (savedUser) {
        console.log("User registered successfully");
        // If the user is successfully saved
        return res.status(200).json({
          message: "User registered successfully",
          status: true
        });
      }
    })
    .catch(err => {
      // Handle error
      console.error("Error:", err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Route to login a user
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email:email });

        if (!user) {
            return res.status(400).json({ message: 'User with this email address does not exist, please register a new user' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.status(200).json({ message: 'User signed in successfully' });
        } else {
            res.status(400).json({ message: 'Password does not match' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//for profile page get details

app.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        console.log('User',user)
        console.log('email',email)
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(9002, '0.0.0.0',()=>{
    console.log('BE started at port 9002')
})