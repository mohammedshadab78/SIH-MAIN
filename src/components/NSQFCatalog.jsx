import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Award, 
  Clock, 
  GraduationCap, 
  IndianRupee, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Sparkles,
  Printer,
  X
} from 'lucide-react';
import { nsqfCourses } from '../data/nsqfCourses';
import { playSmsChime } from '../lib/speechService';

export default function NSQFCatalog({ lang, t, onOpenVoiceBot }) {
  const isEn = lang === 'en';
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    district: 'Sehore',
    education: '10th',
    category: 'General/OBC'
  });
  const [regId, setRegId] = useState('');

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    const generatedId = `GS-2026-ENR-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegId(generatedId);
    playSmsChime();
    setEnrollmentStep(2);
  };

  const cTrans = t?.catalog || {};
  const cSectors = cTrans.sectors || {};

  const sectors = [
    { id: 'all', label: cSectors.all || "All Sectors" },
    { id: 'Agriculture', label: cSectors.Agriculture || "Agriculture" },
    { id: 'Green Jobs', label: cSectors.GreenJobs || "Green Energy" },
    { id: 'AgriTech', label: cSectors.AgriTech || "AgriTech & Drones" },
    { id: 'Animal Husbandry', label: cSectors.AnimalHusbandry || "Dairy & Animal" },
    { id: 'FoodTech', label: cSectors.FoodTech || "FoodTech" },
    { id: 'Handicrafts', label: cSectors.Handicrafts || "Handicrafts" }
  ];

  const filteredCourses = nsqfCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      (course.titleHi && course.titleHi.includes(search)) ||
      course.sector.toLowerCase().includes(search.toLowerCase());

    const matchesSector = 
      selectedSector === 'all' || 
      course.sector.toLowerCase().includes(selectedSector.toLowerCase());

    const matchesLevel = 
      selectedLevel === 'all' || 
      course.nsqfLevel.toString() === selectedLevel;

    return matchesSearch && matchesSector && matchesLevel;
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>{t?.navHome || "Home"}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-orange-700 font-semibold">{t?.navSkilling || "NSQF Skilling"}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full border border-orange-200 mb-2 uppercase">
                <Award className="w-3.5 h-3.5 text-orange-600" />
                <span>{cTrans.badge || "National Skills Qualifications Framework (NSQF)"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{cTrans.title || "Government Certified NSQF Courses"}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {cTrans.subtitle || "Free government training, on-job apprenticeships, and monthly stipends approved by MSDE"}
              </p>
            </div>

            {/* Voice bot button */}
            <button
              onClick={onOpenVoiceBot}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow hover:shadow-md transition-all self-start md:self-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{cTrans.voiceInquire || "Inquire via Voice Bot"}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={cTrans.searchPlaceholder || "Search by course title, sector..."}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Sector Selector */}
            <div className="md:col-span-4">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* NSQF Level Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="all">{cTrans.allLevels || "All Levels"}</option>
                <option value="3">NSQF Level 3</option>
                <option value="4">NSQF Level 4</option>
                <option value="5">NSQF Level 5</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Top Banner */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-200 uppercase tracking-wider">
                    {course.sector}
                  </span>
                  <span className="bg-gov-navy text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                    NSQF Level {course.nsqfLevel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {lang === 'mr' ? (course.titleMr || course.title) : lang === 'hi' ? (course.titleHi || course.title) : course.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {lang === 'en' ? (course.titleHi || course.title) : course.title}
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                  {lang === 'mr' ? (course.overviewMr || course.overview) : lang === 'hi' ? (course.overviewHi || course.overview) : course.overview}
                </p>

                {/* Course Metadata Pills */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {cTrans.duration || "Duration:"}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {course.durationHours} {cTrans.hours || "Hours"} ({course.durationWeeks} wks)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {cTrans.eligibility || "Eligibility:"}
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {lang === 'mr' ? (course.eligibilityMr || course.eligibility) : lang === 'hi' ? (course.eligibilityHi || course.eligibility) : course.eligibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1.5 font-bold">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {cTrans.stipend || "Stipend:"}
                    </span>
                    <span className="font-bold text-xs">{course.stipend}</span>
                  </div>

                  <div className="flex items-center justify-between text-blue-700 bg-blue-50/80 p-2 rounded-lg border border-blue-200">
                    <span className="font-medium text-[11px]">{t?.common?.stipend || "Income"}:</span>
                    <span className="font-bold text-xs">{course.potentialIncome}</span>
                  </div>
                </div>

                {/* Target Job Roles */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {lang === 'hi' ? "संबंधित जॉब रोल्स:" : lang === 'mr' ? "संबंधित नोकरी भूमिका:" : lang === 'bn' ? "কাজের পদসমূহ:" : lang === 'te' ? "ఉద్యోగ పాత్రలు:" : "Job Roles:"}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(lang === 'mr' && course.jobRolesMr ? course.jobRolesMr : lang === 'hi' && course.jobRolesHi ? course.jobRolesHi : course.jobRoles).map((role, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[160px]">
                  {course.certification}
                </span>
                <button
                  onClick={() => setEnrolledCourse(course)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {cTrans.enrollBtn || "Enroll for Free"}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Interactive Batch Enrollment Modal */}
        {enrolledCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-orange-500 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 block">
                    PMKVY 4.0 Skilling Batch
                  </span>
                  <h3 className="font-bold text-base sm:text-lg leading-snug">
                    {isEn ? enrolledCourse.title : (enrolledCourse.titleHi || enrolledCourse.title)}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEnrolledCourse(null);
                    setEnrollmentStep(1);
                  }}
                  className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
                {enrollmentStep === 1 ? (
                  <form onSubmit={handleEnrollSubmit} className="space-y-3.5">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                      <p className="font-bold">{lang === 'hi' ? "महत्वपूर्ण सरकारी लाभ:" : lang === 'mr' ? "महत्त्वाचे सरकारी फायदे:" : lang === 'bn' ? "সরকারি সুবিধাসমূহ:" : lang === 'te' ? "ప్రభుత్వ ప్రయోజనాలు:" : "Government Entitlements:"}</p>
                      <p>✓ 100% Free Training & Certification (MSDE / Govt of India)</p>
                      <p>✓ {cTrans.stipend || "Stipend"}: {enrolledCourse.stipend} (DBT)</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {cTrans.fullName || "Full Name"}: *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={lang === 'hi' ? "उदा. रमेश कुमार / अनिता बाई" : "e.g. Ramesh Kumar"}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {cTrans.mobileNumber || "Mobile Number"}: *
                        </label>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          placeholder="10-digit mobile"
                          maxLength={10}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {cTrans.district || "District"}:
                        </label>
                        <input
                          type="text"
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          placeholder="District"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {cTrans.education || "Education"}:
                        </label>
                        <select
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
                        >
                          <option value="5th">5th Pass / Literate</option>
                          <option value="8th">8th Pass</option>
                          <option value="10th">10th Pass (Matric)</option>
                          <option value="12th">12th Pass / ITI</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Category / SHG:
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
                        >
                          <option value="General/OBC">General / OBC</option>
                          <option value="SC/ST">SC / ST</option>
                          <option value="Women SHG">Women SHG Member</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEnrolledCourse(null)}
                        className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                      >
                        {t?.common?.cancel || "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                      >
                        {cTrans.confirmEnroll || "Confirm Enrollment"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Official Admission Confirmation Slip */
                  <div className="space-y-4 animate-fadeIn">
                    <div id="printable-admission-slip" className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-orange-800 uppercase block">
                              {t?.topBar?.govTitle || "Government of India"} • MSDE
                            </span>
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {cTrans.enrolledSuccessTitle || "Enrollment Confirmed"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          {regId}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p><strong>{cTrans.fullName || "Name"}:</strong> {formData.name}</p>
                        <p><strong>{cTrans.mobileNumber || "Mobile"}:</strong> +91 {formData.mobile}</p>
                        <p><strong>{lang === 'hi' ? "पाठ्यक्रम:" : lang === 'mr' ? "अभ्यासक्रम:" : "Course:"}</strong> {lang === 'mr' ? (enrolledCourse.titleMr || enrolledCourse.title) : lang === 'hi' ? (enrolledCourse.titleHi || enrolledCourse.title) : enrolledCourse.title} (NSQF {enrolledCourse.nsqfLevel})</p>
                        <p><strong>{cTrans.stipend || "Stipend"}:</strong> {enrolledCourse.stipend}</p>
                        <p><strong>{lang === 'hi' ? "प्रशिक्षण केंद्र:" : lang === 'mr' ? "प्रशिक्षण केंद्र:" : "Center:"}</strong> KVK / PMKK Hub ({formData.district || 'MP'})</p>
                        <p><strong>{lang === 'hi' ? "बेंच प्रारंभ:" : lang === 'mr' ? "बॅच सुरू:" : "Batch Start:"}</strong> {lang === 'hi' ? "आगामी सोमवार (आधार कार्ड साथ लाएं)" : lang === 'mr' ? "येत्या सोमवारी (आधार कार्ड सोबत आणा)" : "Upcoming Monday (Carry Aadhaar Card)"}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>{t?.common?.tollFreeNum || "Helpline: 1800-123-9626"}</span>
                        <span>Verified Admission • SIH 2026</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => {
                          const text = `*GramSaksham Batch Enrollment*\nID: ${regId}\nName: ${formData.name}\nCourse: ${enrolledCourse.title}\nHelpline: 1800-123-9626`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📲 WhatsApp Share</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="bg-gov-navy hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t?.common?.print || "Print"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEnrolledCourse(null);
                          setEnrollmentStep(1);
                        }}
                        className="border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                      >
                        {t?.common?.close || "Close"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
