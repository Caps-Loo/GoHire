import React from "react";
import Background from "@/assets/Background.png";

const Hero = () => {
return(
<>
    <section className="min-h-[550px] sm:min-h-[600px]
        bg-blue-500 text-white flex justify-center items-center">
        <div className="container pb-8 sm:pb-0">
            <div className="grid grid-cols-1
        sm:grid-cols-2 gap-8">
                <div>
                <h1 className="text-4xl font-bold">Cari Kerja
                  <span className="text-4xl font-bold text-white"> #Makin mudah</span>
                </h1>

                    <span className="text-4xl font-bold">Pake GoHire</span>
                    <p>
                        {""}
                        GoHire adalah perusahaan yang bergerak di bidang informasi teknologi sekaligus situs lowongan kerja internal
                        berbasis software yang fokus di bidang rekrutmen
                        untuk mempermudah cari pekerjaan dan
                        perekrutan karyawan.
                    </p>
                </div>
                <div>
                    <img src={Background} className="max-w[450px] sm:scale-125 shadow-1 " />
                </div>
            </div>
        </div>
    </section>
</>
)
}

export default Hero;