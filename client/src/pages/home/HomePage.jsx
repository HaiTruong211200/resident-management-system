import React from "react";
import { Link } from "react-router-dom";
import { FaReact } from "react-icons/fa";
import { BiLogoSpringBoot } from "react-icons/bi";
import { GrMysql } from "react-icons/gr";
import { RiFirebaseFill } from "react-icons/ri";
import { TbApi } from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { FaHome } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { AiOutlineTeam } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0b0f3f] text-white font-sans">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-16 py-6 text-lg">
                <div className="font-bold text-xl">.HustCity</div>

                <ul className="flex gap-12 items-center text-[18px]">
                    <Link
                        to="/"
                        className="flex items-center gap-2 border-b-2 border-white pb-1 cursor-pointer" > <FaHome /> Home</Link>

                    <Link
                        to="/about"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300" ><FcAbout /> About</Link>


                    <Link
                        to="/ourteam"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300" ><AiOutlineTeam /> Our Team</Link>

                    <Link
                        to="/contact"
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300" ><FaPhoneVolume /> Contact</Link>
                </ul>
            </nav>

            {/* Hero Section */}
            <div className="flex justify-between items-center px-24 mt-20 relative">

                {/* Text Left */}
                <div className="ml-30">
                    <h1 className="text-6xl font-bold leading-snug">Quản Lý Cư Dân</h1>
                    <p className="text-xl mt-6 text-gray-300">Quản lý hệ thống dân cư hiệu quả</p>

                    <div className="flex gap-6 mt-10">
                        <Link
                            to="/login"
                            className="px-10 py-3 bg-purple-400 text-black font-semibold rounded-xl hover:bg-purple-300 transition"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/login"
                            className="px-10 py-3 border border-teal-300 rounded-xl hover:bg-teal-300 hover:text-black transition"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>

                {/* Image Group */}
                <div className="relative w-[500px] h-[500px]">

                    {/* Large Circle */}
                    <div className="absolute left-6 top-6 w-[420px] h-[420px] rounded-full bg-white flex justify-center items-center shadow-xl">
                        <img src="/Picture_Resident.png" alt="main" className="w-[300px]" />
                    </div>

                    {/* Top Small Circle */}
                    <div className="absolute right-[-40px] top-[-20px] w-[150px] h-[150px] bg-white rounded-full flex justify-center items-center shadow-xl">
                        <img src="/ChungCu.png" alt="chart1" className="w-[80px]" />
                    </div>

                    {/* Bottom Small Circle */}
                    <div className="absolute right-[-70px] bottom-[0px] w-[160px] h-[160px] bg-white rounded-full flex justify-center items-center shadow-xl">
                        <img src="/TronDUoi.png" alt="chart2" className="w-[90px]" />
                    </div>

                </div>

            </div>

            {/* Technologies Section */}
            <div className="mt-32 text-center">
                <div className="bg-white/10 px-6 py-3 rounded-xl inline-block text-gray-300 text-xl mb-4">
                    Technologies used
                </div>

                <div className="flex justify-center gap-16 py-6 text-[16px] text-gray-300 bg-white/10 mx-auto mt-4 rounded-xl w-[85%]">

                    <div className="flex items-center gap-2">
                        <FaReact /> React
                    </div>

                    <div className="flex items-center gap-2">
                        <BiLogoSpringBoot /> Spring Boot
                    </div>

                    <div className="flex items-center gap-2">
                        <GrMysql /> MySQL
                    </div>

                    <div className="flex items-center gap-2">
                        <RiFirebaseFill /> Firebase
                    </div>

                    <div className="flex items-center gap-2">
                        <TbApi /> REST API
                    </div>

                    <div className="flex items-center gap-2">
                        <FaJava /> Java
                    </div>

                    <div className="flex items-center gap-2">
                        <SiTypescript /> TypeScript
                    </div>

                </div>
            </div>

        </div >
    );
}