import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Headphones, Award, Leaf, TrendingUp, CreditCard, Bike, BadgeCheck, RefreshCcw, Lock, MapPin } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  })
};

const stats = [
  { value: '100%', label: 'Chính hãng', icon: Award },
  { value: '24/7', label: 'Hỗ trợ liên tục', icon: Headphones },
  { value: '0%', label: 'Lãi suất trả góp', icon: CreditCard },
  { value: '3 Năm', label: 'Bảo hành chính hãng', icon: Shield },
];

const values = [
  {
    icon: Zap,
    title: 'Pin siêu bền',
    desc: 'Công nghệ pin lithium thế hệ mới, sạc nhanh, hành trình xa. Mỗi chiếc xe được kiểm tra pin nghiêm ngặt trước khi giao tay khách hàng.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Bảo hành tận nhà',
    desc: 'Chính sách bảo hành chính hãng lên đến 3 năm, đội ngũ kỹ thuật sẵn sàng đến tận nơi hỗ trợ – không phiền phức, không chờ đợi.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Leaf,
    title: 'Giá cả cạnh tranh',
    desc: 'Cam kết minh bạch giá niêm yết, không phát sinh chi phí ẩn. Hỗ trợ thanh toán trực tuyến an toàn và trả góp linh hoạt qua VNPAY.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

const About = () => {
  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[480px] flex items-center text-white overflow-hidden">
        {/* Background image */}
        <img
          src="/images/hero-banner.jpg"
          alt="Showroom NHẬT."
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-blue-200 text-sm font-bold uppercase tracking-[0.2em] mb-4"
          >
            Câu chuyện của chúng tôi
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
          >
            Về&nbsp;
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-200">
              NHẬT.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Chúng tôi tự hào mang đến giải pháp di chuyển xanh, cung cấp các dòng xe máy điện hiện đại, an toàn và thân thiện với môi trường.
          </motion.p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-6 flex flex-col items-center text-center"
            >
              <s.icon className="w-7 h-7 text-blue-500 mb-3" />
              <span className="text-3xl font-black text-slate-900">{s.value}</span>
              <span className="text-xs font-semibold text-slate-500 mt-1 leading-tight">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">Sứ mệnh & Tầm nhìn</p>
            <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
              Di chuyển sạch hơn.<br />
              <span className="text-blue-600">Tương lai tươi sáng hơn.</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              Được xây dựng từ đam mê với công nghệ xanh, <strong>NHẬT.</strong> mang đến nền tảng thương mại điện tử hiện đại, giúp khách hàng dễ dàng tiếp cận những mẫu xe điện chất lượng với trải nghiệm mua sắm mượt mà nhất.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Mục tiêu của chúng tôi là phủ xanh đường phố, đồng hành cùng bạn trên mọi nẻo đường với những sản phẩm an toàn, thông minh và thân thiện với môi trường.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25"
            >
              <Zap className="w-4 h-4" />
              Khám phá sản phẩm ngay
            </Link>
          </motion.div>

          {/* Visual card – photo */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50">
              <img
                src="/images/mission-visual.jpg"
                alt="Showroom xe điện NHẬT."
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl px-5 py-3 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Chất lượng</p>
              <p className="text-xl font-black text-slate-900">100% Chính hãng</p>
              <p className="text-xs text-slate-500">Cam kết từ nhà sản xuất</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}


      {/* ── STORE LOCATION ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.18em] mb-3 flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" /> Địa chỉ showroom
          </p>
          <h2 className="text-4xl font-black text-slate-900">Ghé thăm Showroom của chúng tôi</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left – Showroom photo */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/60 border border-slate-100 min-h-[320px]"
          >
            <img
              src="/images/showroom-mat-tien.jpg"
              alt="Showroom"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right – Google Maps */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/60 border border-slate-100 min-h-[320px]"
          >
            <iframe
              src="https://www.google.com/maps?q=131+Duong+Thanh+Loc+19,+Thanh+Loc,+Ho+Chi+Minh&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block', minHeight: '320px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ showroom NHẬT."
            />
          </motion.div>
        </div>
      </section>

      {/* ── CUSTOMER POLICIES ── */}
      <section className="bg-slate-50 border-t border-slate-100 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">Cam kết với khách hàng</p>
            <h2 className="text-4xl font-black text-slate-900">Chính sách &amp; Cam kết</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 – Thanh toán & Trả góp */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Thanh toán &amp; Trả góp</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Hỗ trợ thanh toán qua <strong>VNPAY</strong>, chuyển khoản, tiền mặt và hỗ trợ trả góp <strong>0% lãi suất</strong>.
              </p>
            </motion.div>

            {/* Card 2 – Kiểm hàng & Thử xe */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Bike className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Kiểm hàng &amp; Thử xe</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Khách hàng được quyền kiểm tra và chạy thử xe trước khi xác nhận nhận hàng.
              </p>
            </motion.div>

            {/* Card 3 – Bảo hành chính hãng */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Bảo hành chính hãng</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Bảo hành <strong>3 năm</strong> cho pin và động cơ. Hỗ trợ bảo hành tận nhà không phát sinh chi phí.
              </p>
            </motion.div>

            {/* Card 4 – Đổi trả & Hoàn tiền */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <RefreshCcw className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Đổi trả &amp; Hoàn tiền</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Đổi mới trong <strong>7 ngày</strong> nếu có lỗi từ nhà sản xuất. Hoàn tiền <strong>100%</strong> nếu giao sai xe.
              </p>
            </motion.div>

            {/* Card 5 – Bảo mật thông tin (chiếm 2 cột) */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow md:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Bảo mật thông tin</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Chúng tôi cam kết <strong>tuyệt đối bảo mật</strong> thông tin cá nhân và lịch sử giao dịch của khách hàng theo tiêu chuẩn cao nhất.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
