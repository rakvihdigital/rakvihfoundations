"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import { ChangeEvent } from "react";

interface Props {
  formData: {
    full_name: string;
    email: string;
    phone: string;
    college: string;
    branch: string;
    year: string;
    address: string;
  };

  handleChangeAction: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function EnrollmentForm({
  formData,
  handleChangeAction,
}: Props) {
  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void {
    handleChangeAction(event);
  }

  return (

<motion.div
initial={{opacity:0,x:-40}}
animate={{opacity:1,x:0}}
transition={{duration:.7}}

className="
rounded-[36px]
bg-white
dark:bg-[#111827]
shadow-[0_30px_80px_rgba(121,131,33,.12)]
border
border-[#798321]/10
p-8
"

>

{/* Heading */}

<div>

<p
className="
text-xs
uppercase
tracking-[4px]
font-bold
text-[#FFC107]
"
>

Student Details

</p>

<h2
className="
mt-3
text-3xl
font-black
text-[#798321]
dark:text-white
"
>

Complete Your Application

</h2>

<p
className="
mt-3
text-sm
leading-7
text-slate-500
dark:text-slate-300
"
>

Fill in your information carefully.
Our team will verify your application
before confirming enrollment.

</p>

</div>

{/* Form */}

<div className="mt-10 space-y-7">

{/* Full Name */}

<div>

<label
className="
mb-3
block
text-xs
font-bold
uppercase
tracking-[3px]
text-[#798321]
dark:text-[#FFC107]
"
>

Full Name

</label>

<div
className="
flex
items-center
rounded-2xl
border
border-[#798321]/15
bg-[#F8FBF3]
px-5
dark:bg-[#0F172A]
dark:border-slate-700
"
>

<User
size={18}
className="text-[#798321]"
/>

<input
name="full_name"
value={formData.full_name}
onChange={handleChange}
placeholder="Enter your full name"

className="
h-14
w-full
bg-transparent
px-4
text-sm
outline-none
dark:text-white
"
/>

</div>

</div>

{/* Email + Phone */}

<div className="grid gap-6 md:grid-cols-2">

{/* Email */}

<div>

<label
className="
mb-3
block
text-xs
font-bold
uppercase
tracking-[3px]
text-[#798321]
dark:text-[#FFC107]
"
>

Email

</label>

<div
className="
flex
items-center
rounded-2xl
border
border-[#798321]/15
bg-[#F8FBF3]
px-5
dark:bg-[#0F172A]
dark:border-slate-700
"
>

<Mail
size={18}
className="text-[#798321]"
/>

<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
placeholder="Enter email"

className="
h-14
w-full
bg-transparent
px-4
text-sm
outline-none
dark:text-white
"
/>

</div>

</div>

{/* Phone */}

<div>

<label
className="
mb-3
block
text-xs
font-bold
uppercase
tracking-[3px]
text-[#798321]
dark:text-[#FFC107]
"
>

Phone Number

</label>

<div
className="
flex
items-center
rounded-2xl
border
border-[#798321]/15
bg-[#F8FBF3]
px-5
dark:bg-[#0F172A]
dark:border-slate-700
"
>

<Phone
size={18}
className="text-[#798321]"
/>

<input
name="phone"
value={formData.phone}
onChange={handleChange}
placeholder="Enter mobile number"

className="
h-14
w-full
bg-transparent
px-4
text-sm
outline-none
dark:text-white
"
/>

</div>

</div>

</div>

{/* College */}

<div>

<label
className="
mb-3
block
text-xs
font-bold
uppercase
tracking-[3px]
text-[#798321]
dark:text-[#FFC107]
"
>

College Name

</label>

<div
className="
flex
items-center
rounded-2xl
border
border-[#798321]/15
bg-[#F8FBF3]
px-5
dark:bg-[#0F172A]
dark:border-slate-700
"
>

<GraduationCap
size={18}
className="text-[#798321]"
/>

<input
name="college"
value={formData.college}
onChange={handleChange}
placeholder="Enter college name"

className="
h-14
w-full
bg-transparent
px-4
text-sm
outline-none
dark:text-white
"
/>

</div>

</div>
{/* Branch + Year */}

<div className="grid gap-6 md:grid-cols-2">

  {/* Branch */}

  <div>

    <label
      className="
      mb-3
      block
      text-xs
      font-bold
      uppercase
      tracking-[3px]
      text-[#798321]
      dark:text-[#FFC107]
      "
    >
      Branch
    </label>

    <input
      name="branch"
      value={formData.branch}
      onChange={handleChange}
      placeholder="CSE / ECE / IT"

      className="
      h-14
      w-full
      rounded-2xl
      border
      border-[#798321]/15
      bg-[#F8FBF3]
      px-5
      text-sm
      outline-none
      transition
      focus:border-[#798321]
      focus:ring-4
      focus:ring-[#798321]/10
      dark:bg-[#0F172A]
      dark:border-slate-700
      dark:text-white
      "
    />

  </div>

  {/* Year */}

  <div>

    <label
      className="
      mb-3
      block
      text-xs
      font-bold
      uppercase
      tracking-[3px]
      text-[#798321]
      dark:text-[#FFC107]
      "
    >
      Academic Year
    </label>

    <select
      name="year"
      value={formData.year}
      onChange={handleChange}

      className="
      h-14
      w-full
      rounded-2xl
      border
      border-[#798321]/15
      bg-[#F8FBF3]
      px-5
      text-sm
      outline-none
      transition
      focus:border-[#798321]
      focus:ring-4
      focus:ring-[#798321]/10
      dark:bg-[#0F172A]
      dark:border-slate-700
      dark:text-white
      "
    >
      <option value="">Select Year</option>
      <option>1st Year</option>
      <option>2nd Year</option>
      <option>3rd Year</option>
      <option>4th Year</option>
      <option>Graduate</option>
    </select>

  </div>

</div>

{/* Address */}

<div>

  <label
    className="
    mb-3
    block
    text-xs
    font-bold
    uppercase
    tracking-[3px]
    text-[#798321]
    dark:text-[#FFC107]
    "
  >
    Address
  </label>

  <textarea
    rows={4}
    name="address"
    value={formData.address}
    onChange={handleChange}
    placeholder="Enter your complete address"

    className="
    w-full
    rounded-2xl
    border
    border-[#798321]/15
    bg-[#F8FBF3]
    p-5
    text-sm
    outline-none
    transition
    focus:border-[#798321]
    focus:ring-4
    focus:ring-[#798321]/10
    dark:bg-[#0F172A]
    dark:border-slate-700
    dark:text-white
    "
  />

</div>

{/* Upload Section */}

<div className="grid gap-6 md:grid-cols-2">

  {/* Photo */}

  <div
    className="
    rounded-3xl
    border-2
    border-dashed
    border-[#798321]/20
    bg-[#F8FBF3]
    p-8
    text-center
    transition
    hover:border-[#798321]
    dark:bg-[#0F172A]
    dark:border-slate-700
    "
  >

    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#798321]/10">

      📷

    </div>

    <h4 className="mt-5 font-bold text-[#798321] dark:text-white">

      Upload Photo

    </h4>

    <p className="mt-2 text-xs text-slate-500">

      JPG • PNG • Max 2MB

    </p>

    <input
      type="file"
      className="mt-5 w-full text-xs"
    />

  </div>

  {/* Resume */}

  <div
    className="
    rounded-3xl
    border-2
    border-dashed
    border-[#FFC107]/30
    bg-[#FFF9E8]
    p-8
    text-center
    transition
    hover:border-[#FFC107]
    dark:bg-[#111827]
    dark:border-slate-700
    "
  >

    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC107]/20">

      📄

    </div>

    <h4 className="mt-5 font-bold text-[#798321] dark:text-white">

      Upload Resume

    </h4>

    <p className="mt-2 text-xs text-slate-500">

      PDF • DOC • DOCX

    </p>

    <input
      type="file"
      className="mt-5 w-full text-xs"
    />

  </div>

</div>
{/* Terms & Conditions */}

<div className="mt-8 rounded-3xl border border-[#798321]/15 bg-[#F8FBF3] p-6 dark:border-slate-700 dark:bg-[#0F172A]">

  <label className="flex items-start gap-4 cursor-pointer">

    <input
      type="checkbox"
      className="
      mt-1
      h-5
      w-5
      rounded
      accent-[#798321]
      "
    />

    <span className="text-sm leading-7 text-slate-600 dark:text-slate-300">

      I hereby confirm that all the information provided is true and
      correct. I agree to the Internship Program Terms & Conditions and
      understand that my enrollment will be confirmed only after
      successful verification and payment.

    </span>

  </label>

</div>

{/* Security Note */}

<div
  className="
  mt-6
  rounded-3xl
  bg-gradient-to-r
  from-[#798321]
  via-[#8A8F2A]
  to-[#FFC107]
  p-6
  text-white
  "
>

  <h4 className="text-lg font-bold">

    🔒 Secure Enrollment

  </h4>

  <p className="mt-2 text-sm leading-7 text-white/90">

    Your personal information is encrypted and securely stored.
    Rakvih Solutions never shares your data with third parties.

  </p>

</div>

{/* Button */}

<motion.button

whileHover={{
  scale: 1.02,
}}

whileTap={{
  scale: .98,
}}

className="
group
relative
mt-8
flex
h-16
w-full
items-center
justify-center
overflow-hidden
rounded-2xl
bg-gradient-to-r
from-[#798321]
via-[#8A8F2A]
to-[#FFC107]
text-lg
font-bold
text-white
shadow-[0_20px_60px_rgba(121,131,33,.35)]
"

>

<span
className="
absolute
inset-0
translate-x-[-120%]
bg-gradient-to-r
from-transparent
via-white/30
to-transparent
transition-all
duration-1000
group-hover:translate-x-[120%]
"
/>

<span className="relative z-10 flex items-center gap-3">

Continue to Payment

<span className="text-2xl">

→

</span>

</span>

</motion.button>

{/* Footer */}

<p
className="
mt-6
text-center
text-xs
leading-6
text-slate-500
dark:text-slate-400
"
>

Need help with enrollment?

<span className="font-semibold text-[#798321]">

 Contact our support team.

</span>

</p>

</div>

</motion.div>

);
}