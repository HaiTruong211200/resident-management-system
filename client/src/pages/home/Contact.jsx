import React from "react";
import { Link } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt, FaGlobe } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { AiOutlineTeam } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-[#e6e0e0] text-[#0b0f3f] font-sans">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-16 py-5 bg-[#0b0f3f] text-white text-lg">
                <div className="font-bold text-xl">.HustCity</div>

                <ul className="flex gap-12 items-center text-[18px]">
                    <Link
                        to="/"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300" >
                        <FaHome /> Home
                    </Link>

                    <Link
                        to="/about"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300" >
                        <FcAbout /> About
                    </Link>


                    <Link
                        to="/ourteam"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300" >
                        <AiOutlineTeam /> Our Team
                    </Link>

                    <Link
                        to="/contact"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300 border-b-2 border-white pb-1" >
                        <FaPhoneVolume /> Contact
                    </Link>
                </ul>
            </nav>

            {/* Title */}
            <div className="text-center mt-10">
                <h1 className="text-4xl font-extrabold tracking-wide">CONTACT US</h1>
                <div className="w-32 h-1 bg-[#0b0f3f] mx-auto mt-3 rounded"></div>
            </div>

            {/* Main content */}
            <div className="flex justify-between px-32 mt-12">

                {/* Left Info */}
                <div className="space-y-6 text-lg text-[#0b0f3f]">
                    <div className="flex items-center gap-4">
                        <FaMapMarkerAlt className="text-2xl" />
                        <p>1 D. Dai Co Viet, Hai Ba Trung, Ha Noi</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <MdEmail className="text-2xl" />
                        <p>infor@departmentwebsite.com</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <FaPhoneAlt className="text-xl" />
                        <p>(+84) 123 456 789</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <FaClock className="text-xl" />
                        <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <FaClock className="text-xl" />
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <FaClock className="text-xl" />
                        <p>Sunday: Closed</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <FaGlobe className="text-xl" />
                        <p>www.department.com</p>
                    </div>
                </div>

                {/* Right Form */}
                <div className="w-[450px] space-y-5">
                    <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Your email"
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
                    />

                    <textarea
                        placeholder="Your messages"
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
                    ></textarea>

                    <button className="px-8 py-2 bg-[#3e2c83] text-white rounded-xl hover:bg-[#2d2261] transition" type="submit">
                        Submit
                    </button>
                </div>

            </div>

            {/* Footer */}
            <footer className="mt-20 py-5 px-16 bg-black text-gray-300 flex justify-between text-sm">
                <p>© 2025 Department Web</p>
                <p>Privacy policy • Refund policy</p>
            </footer>

        </div>
    );
}
