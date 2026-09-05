"use client";

import { useState } from "react";
import ContactInfo from "./ContactInfo";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("contact_messages")
      .insert([formData]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Message sent successfully!");

    setFormData({
      full_name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section
      className="
        bg-white
        dark:bg-black

        py-10
        sm:py-14

        transition-all
        duration-500
      "
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">

        {/* Left Side */}

        <div>

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[4px]

              text-[#FFC107]
            "
          >
            Contact Form
          </p>

          <h2
            className="
              mt-2

              text-4xl
              font-black
              tracking-tight

              text-[#798321]
              dark:text-white
            "
          >
            Get In Touch
          </h2>

          <p
            className="
              mt-3

              text-sm
              leading-7
              font-medium

              text-[#374151]
              dark:text-neutral-300
            "
          >
            Fill out the form below and our team will contact you
            as soon as possible.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-5"
          >

            <div className="grid gap-5 md:grid-cols-2">
                            {/* Full Name */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold

                    text-[#5F6E1D]
                    dark:text-white
                  "
                >
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="
                    w-full

                    rounded-xl

                    border
                    border-[#798321]/20
                    dark:border-neutral-800

                    bg-[#F8FAF1]/30
                    dark:bg-[#0a0a0a]

                    px-4
                    py-3

                    text-sm
                    font-medium

                    text-[#374151]
                    dark:text-white

                    placeholder:text-gray-400
                    dark:placeholder:text-neutral-500

                    outline-none

                    transition-all
                    duration-300

                    focus:border-[#798321]
                    dark:focus:border-[#FFC107]

                    focus:bg-white
                    dark:focus:bg-[#171717]

                    focus:shadow-[0_0_0_4px_rgba(121,131,33,0.08)]
                  "
                />

              </div>

              {/* Email */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold

                    text-[#5F6E1D]
                    dark:text-white
                  "
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="
                    w-full

                    rounded-xl

                    border
                    border-[#798321]/20
                    dark:border-neutral-800

                    bg-[#F8FAF1]/30
                    dark:bg-[#0a0a0a]

                    px-4
                    py-3

                    text-sm
                    font-medium

                    text-[#374151]
                    dark:text-white

                    placeholder:text-gray-400
                    dark:placeholder:text-neutral-500

                    outline-none

                    transition-all
                    duration-300

                    focus:border-[#798321]
                    dark:focus:border-[#FFC107]

                    focus:bg-white
                    dark:focus:bg-[#171717]

                    focus:shadow-[0_0_0_4px_rgba(121,131,33,0.08)]
                  "
                />

              </div>

            </div>

            {/* Phone Number */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold

                  text-[#5F6E1D]
                  dark:text-white
                "
              >
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="
                  w-full

                  rounded-xl

                  border
                  border-[#798321]/20
                  dark:border-neutral-800

                  bg-[#F8FAF1]/30
                  dark:bg-[#0a0a0a]

                  px-4
                  py-3

                  text-sm
                  font-medium

                  text-[#374151]
                  dark:text-white

                  placeholder:text-gray-400
                  dark:placeholder:text-neutral-500

                  outline-none

                  transition-all
                  duration-300

                  focus:border-[#798321]
                  dark:focus:border-[#FFC107]

                  focus:bg-white
                  dark:focus:bg-[#171717]

                  focus:shadow-[0_0_0_4px_rgba(121,131,33,0.08)]
                "
              />

            </div>
                        {/* Subject */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold

                  text-[#5F6E1D]
                  dark:text-white
                "
              >
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
                className="
                  w-full

                  rounded-xl

                  border
                  border-[#798321]/20
                  dark:border-neutral-800

                  bg-[#F8FAF1]/30
                  dark:bg-[#0a0a0a]

                  px-4
                  py-3

                  text-sm
                  font-medium

                  text-[#374151]
                  dark:text-white

                  placeholder:text-gray-400
                  dark:placeholder:text-neutral-500

                  outline-none

                  transition-all
                  duration-300

                  focus:border-[#798321]
                  dark:focus:border-[#FFC107]

                  focus:bg-white
                  dark:focus:bg-[#171717]

                  focus:shadow-[0_0_0_4px_rgba(121,131,33,0.08)]
                "
              />

            </div>

            {/* Message */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold

                  text-[#5F6E1D]
                  dark:text-white
                "
              >
                Message
              </label>

              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
                className="
                  w-full

                  resize-none

                  rounded-xl

                  border
                  border-[#798321]/20
                  dark:border-neutral-800

                  bg-[#F8FAF1]/30
                  dark:bg-[#0a0a0a]

                  px-4
                  py-3

                  text-sm
                  font-medium

                  text-[#374151]
                  dark:text-white

                  placeholder:text-gray-400
                  dark:placeholder:text-neutral-500

                  outline-none

                  transition-all
                  duration-300

                  focus:border-[#798321]
                  dark:focus:border-[#FFC107]

                  focus:bg-white
                  dark:focus:bg-[#171717]

                  focus:shadow-[0_0_0_4px_rgba(121,131,33,0.08)]
                "
              />

            </div>

            {/* Submit Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-[#798321]
                dark:bg-[#FFC107]

                py-3

                text-sm
                font-bold

                text-[#FFC107]
                dark:text-black

                shadow-sm

                transition-all
                duration-300

                hover:scale-[1.02]

                hover:bg-[#5F6E1D]
                hover:text-white

                dark:hover:bg-[#ffca28]
                dark:hover:text-black

                disabled:opacity-60
                disabled:transform-none
              "
            >
              {loading ? "Sending..." : "Send Message"}

              <ArrowRight size={18} />

            </button>

          </form>
                  </div>

        {/* Right Side */}

        <ContactInfo />

      </div>

    </section>
  );
}