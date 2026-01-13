/*
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import imageDownloader from 'image-downloader';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Place from './models/Place.js';
import Booking from './models/Booking.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';

// path  __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(arcjetMiddleware);

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return reject(err);
            }
            resolve(user);
        });
    });
}

//REGISTER
app.post('/register', async(req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            const error = new Error("User already existing");
            error.status = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const Users = await User.create({
            name,
            email,
            password: passwordHash
        });
        res.status(201).json({success: true, data: {id: Users._id, name: Users.name, email: Users.email}});
        
    } catch (error) {
        next(error);
    }
});

//LOGIN
app.post('/login', async(req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            const error = new Error("Email and password are required");
            error.status = 401;
            throw error;
        }

        const userDoc = await User.findOne({email});

        if(!userDoc) {
            const error = new Error("Invalid credentials");
            error.status = 400;
            throw error;
        }

        const passwordMatch = await bcrypt.compare(password, userDoc.password);
       
        if(!passwordMatch) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }
        const token = jwt.sign(
            {id: userDoc._id, email: userDoc.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.cookie('token', token);
        
        res.json({success: true, message: "Login successfully", token, data: {id: userDoc._id, name: userDoc.name, email: userDoc.email}});
    } catch (error) {
        next(error);
    }
});

//PROFILE
app.get('/profile', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).json({
                success: false,
                error: "Not authorized"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const userDoc = await User.findById(user.id).select('-password');
                if(!userDoc) {
                    return res.status(401).json({
                        success: false,
                        error: "User not found"
                    });
                }

                res.json({success: true, data: {id: userDoc._id, name: userDoc.name, email: userDoc.email}});

            } catch(e) {
                next(e);
            }
        });

    } catch (error) {
        next(error);
    }
});

//LOGOUT
app.post('/logout', async(req, res, next) => {
    try {
        res.cookie('token', '').json({success: true});
    } catch (error) {
        next(error);
    }
});

//UPLOADS-BY-LINK
app.post('/upload-by-link', async(req, res, next) => {
    try {
        const {link} = req.body;
        const newName = 'photo' + Date.now() + '.jpg';
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName
        });

        res.json(newName);

    } catch (error) {
        next(error);
    }
});

//UPLOAD-LOCALFILE
const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), async(req, res, next) => {
    try {
        const uploadedFiles = [];
        for(let i = 0; i < req.files.length; i++) {
            const {path: filePath, originalname} = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = filePath + '.' + ext;
            fs.renameSync(filePath, newPath);
            const filename = path.basename(newPath);
            uploadedFiles.push(filename);
        }
        res.json(uploadedFiles);
    } catch (error) {
        next(error);
    }
});

//ADD PLACES
app.post('/places', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const placesDocs = await Place.create({
                    owner: user.id,
                    title,
                    address,
                    photos: addedPhotos,
                    description,
                    perks,
                    extraInfo,
                    checkIn,
                    checkOut,
                    maxGuests,
                    price
                });

                res.status(201).json(placesDocs);
                
            } catch (error) {
                next(error);
            }
        });
        
    } catch (error) {
        next(error);
    }
});

//GET USER ALL PLACES
app.get('/getPlaces', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            const {id} = user;
            const places = await Place.find({owner: id});
            res.status(202).json(places);
        });

    } catch (error) {
        next(error);
    }
});

//GET PLACE BY ID
app.get('/getPlacesById/:id', async(req, res, next) => {
    try {
        const placeId = await Place.findById(req.params.id);
        if(!placeId) {
            return res.status(404).json({success: false, error: "Id not found"});
        }
        res.json(placeId);

    } catch (error) {
        next(error);
    }
});

//UPDATE PLACES
app.put('/placesUpdate', async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        const {id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const placeDoc = await Place.findById(id);
                if(!placeDoc) {
                    return res.status(404).json({success: false, error: "Place not found"});
                }
                if(user.id != placeDoc.owner) {
                    return res.status(403).json({success: false, error: "Not authorized to update this place"});
                }

                placeDoc.set({
                    title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
                });

                await placeDoc.save();
                res.status(200).json(placeDoc);

            } catch(e) {
                next(e);
            }
        });

    } catch (error) {
        next(error);
    }
});

//LIST OF ALL PLACES
app.get('/listPlaces', async(req, res, next) => {
    try {
        const places = await Place.find();
        if(!places) {
            return res.status(404).json({success: false, error: "No places found"});
        }
        res.json(places);
        
    } catch (error) {
        next(error);
    }
});

//DELETE PHOTO
app.delete('/delete-photo', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        const {filename, placeId} = req.body;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const placeDoc = await Place.findById(placeId);
                if(!placeDoc) {
                    return res.status(404).json({success: false, error: "Place not found"});
                }
                if(user.id != placeDoc.owner) {
                    return res.status(403).json({success: false, error: "Not authorized to update this place"});
                }

                // Delete the physical file
                const filePath = path.join(__dirname, 'uploads', filename);
                if(fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                placeDoc.photos = placeDoc.photos.filter(photo => photo !== filename);

                await placeDoc.save();
                res.status(200).json({success: true, message: "Photo deleted successfully"});

            } catch(e) {
                next(e);
            }
        });
        
    } catch (error) {
        next(error);
    }
});

//SAVE BOOKING
app.post('/bookings', async(req, res, next) => {
    try {
        const userData = await getUserDataFromReq(req);
        const {
            place,
            checkIn,
            checkOut,
            guests,
            name,
            phone,
            price
        } = req.body;
        
        const bookingDocs = await Booking.create({
            place,
            checkIn,
            checkOut,
            guests,
            name,
            phone,
            price,
            user: userData.id
        });

        if(!bookingDocs) {
            return res.status(404).json({success: false, error: "Booking not found"});
        }

        res.json(bookingDocs);

    } catch (error) {
        next(error);
    }
});

//GET BOOKINGS
app.get('/getBookings', async(req, res, next) => {
    try {
        const userData = await getUserDataFromReq(req);
        const bookings = await Booking.find({user: userData.id}).populate('place');
        if(!bookings) {
            return res.status(404).json({success: false, error: "No bookings found"});
        }
        res.json(bookings);

    } catch (error) {
        next(error);
    }
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Mongodb connected succesfully!!");
        
    } catch (error) {
        console.log(`${error.message} dit not connect to the database`);
        process.exit(1);
    }
};

const port = process.env.PORT || 3000;
app.listen(port, async() => {
    console.log(`server running on http://localhost:${port}`);
    await connectDB();
});

*/


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import imageDownloader from 'image-downloader';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Place from './models/Place.js';
import Booking from './models/Booking.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import upload, {cloudinary} from './config/cloudinary.js';

// path  __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(arcjetMiddleware);

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return reject(err);
            }
            resolve(user);
        });
    });
}

//REGISTER
app.post('/register', async(req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            const error = new Error("User already existing");
            error.status = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const Users = await User.create({
            name,
            email,
            password: passwordHash
        });
        res.status(201).json({success: true, data: {id: Users._id, name: Users.name, email: Users.email}});
        
    } catch (error) {
        next(error);
    }
});

//LOGIN
app.post('/login', async(req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            const error = new Error("Email and password are required");
            error.status = 401;
            throw error;
        }

        const userDoc = await User.findOne({email});

        if(!userDoc) {
            const error = new Error("Invalid credentials");
            error.status = 400;
            throw error;
        }

        const passwordMatch = await bcrypt.compare(password, userDoc.password);
       
        if(!passwordMatch) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }
        const token = jwt.sign(
            {id: userDoc._id, email: userDoc.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.cookie('token', token);
        
        res.json({success: true, message: "Login successfully", token, data: {id: userDoc._id, name: userDoc.name, email: userDoc.email}});
    } catch (error) {
        next(error);
    }
});

//PROFILE
app.get('/profile', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).json({
                success: false,
                error: "Not authorized"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const userDoc = await User.findById(user.id).select('-password');
                if(!userDoc) {
                    return res.status(401).json({
                        success: false,
                        error: "User not found"
                    });
                }

                res.json({success: true, data: {id: userDoc._id, name: userDoc.name, email: userDoc.email}});

            } catch(e) {
                next(e);
            }
        });

    } catch (error) {
        next(error);
    }
});

//LOGOUT
app.post('/logout', async(req, res, next) => {
    try {
        res.cookie('token', '').json({success: true});
    } catch (error) {
        next(error);
    }
});

//UPLOADS-BY-LINK
app.post('/upload-by-link', async(req, res, next) => {
    try {
        const {link} = req.body;

        if(!link){
            return res.status(400).json({success:false,error: 'Link is required'})
        }
        
        const result = await cloudinary.uploader.upload(link,{
            folder: "tsidika-places"
        })

        res.json(result.secure_url);

    } catch (error) {
        next(error);
    }
});

//UPLOAD-LOCALFILE
app.post('/upload', upload.array('photos', 100), async(req, res, next) => {
    try {
        const uploadedFiles = [];
        for(let file of req.files) {
            uploadedFiles.push(file.path)
        }
        res.json(uploadedFiles);
    } catch (error) {
        next(error);
    }
});

//ADD PLACES
app.post('/places', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const placesDocs = await Place.create({
                    owner: user.id,
                    title,
                    address,
                    photos: addedPhotos,
                    description,
                    perks,
                    extraInfo,
                    checkIn,
                    checkOut,
                    maxGuests,
                    price
                });

                res.status(201).json(placesDocs);
                
            } catch (error) {
                next(error);
            }
        });
        
    } catch (error) {
        next(error);
    }
});

//GET USER ALL PLACES
app.get('/getPlaces', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            const {id} = user;
            const places = await Place.find({owner: id});
            res.status(202).json(places);
        });

    } catch (error) {
        next(error);
    }
});

//GET PLACE BY ID
app.get('/getPlacesById/:id', async(req, res, next) => {
    try {
        const placeId = await Place.findById(req.params.id);
        if(!placeId) {
            return res.status(404).json({success: false, error: "Id not found"});
        }
        res.json(placeId);

    } catch (error) {
        next(error);
    }
});

//UPDATE PLACES
app.put('/placesUpdate', async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        const {id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const placeDoc = await Place.findById(id);
                if(!placeDoc) {
                    return res.status(404).json({success: false, error: "Place not found"});
                }
                if(user.id != placeDoc.owner) {
                    return res.status(403).json({success: false, error: "Not authorized to update this place"});
                }

                placeDoc.set({
                    title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
                });

                await placeDoc.save();
                res.status(200).json(placeDoc);

            } catch(e) {
                next(e);
            }
        });

    } catch (error) {
        next(error);
    }
});

//LIST OF ALL PLACES
app.get('/listPlaces', async(req, res, next) => {
    try {
        const places = await Place.find();
        if(!places) {
            return res.status(404).json({success: false, error: "No places found"});
        }
        res.json(places);
        
    } catch (error) {
        next(error);
    }
});

//DELETE PHOTO
app.delete('/delete-photo', async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            const error = new Error("Not authorized");
            error.status = 401;
            throw error;
        }
        const {filename, placeId} = req.body;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if(err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token"
                });
            }
            try {
                const placeDoc = await Place.findById(placeId);
                if(!placeDoc) {
                    return res.status(404).json({success: false, error: "Place not found"});
                }
                if(user.id != placeDoc.owner) {
                    return res.status(403).json({success: false, error: "Not authorized to update this place"});
                }

                // extract public_id from url cloudinary
                const urlParts = filename.split('/')
                const publicIdWithExt=urlParts[urlParts.length-1]
                const publicId='tsidika-places/'+publicIdWithExt.split('.')[0]

                //delete on cloudinary
                await cloudinary.uploader.destroy(publicId)

                placeDoc.photos = placeDoc.photos.filter(photo => photo !== filename);

                await placeDoc.save();
                res.status(200).json({success: true, message: "Photo deleted successfully"});

            } catch(e) {
                next(e);
            }
        });
        
    } catch (error) {
        next(error);
    }
});

//SAVE BOOKING
app.post('/bookings', async(req, res, next) => {
    try {
        const userData = await getUserDataFromReq(req);
        const {
            place,
            checkIn,
            checkOut,
            guests,
            name,
            phone,
            price
        } = req.body;
        
        const bookingDocs = await Booking.create({
            place,
            checkIn,
            checkOut,
            guests,
            name,
            phone,
            price,
            user: userData.id
        });

        if(!bookingDocs) {
            return res.status(404).json({success: false, error: "Booking not found"});
        }

        res.json(bookingDocs);

    } catch (error) {
        next(error);
    }
});

//GET BOOKINGS
app.get('/getBookings', async(req, res, next) => {
    try {
        const userData = await getUserDataFromReq(req);
        const bookings = await Booking.find({user: userData.id}).populate('place');
        if(!bookings) {
            return res.status(404).json({success: false, error: "No bookings found"});
        }
        res.json(bookings);

    } catch (error) {
        next(error);
    }
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Mongodb connected succesfully!!");
        
    } catch (error) {
        console.log(`${error.message} dit not connect to the database`);
        process.exit(1);
    }
};

const port = process.env.PORT || 3000;
app.listen(port, async() => {
    console.log(`server running on http://localhost:${port}`);
    await connectDB();
});