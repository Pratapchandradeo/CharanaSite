import React from 'react';
import JagannathLogo from '../common/JagannathLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white pt-16 pb-10 overflow-hidden">

      {/* 🔴 Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-[#1a0000]" />

        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fbb829 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container-custom relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* 🛕 About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <JagannathLogo size="md" />
              <span className="text-xl font-bold text-[#fbb829]">
                ଜଗନ୍ନାଥ
              </span>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
              ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଭକ୍ତମାନଙ୍କ ପାଇଁ ଏକ ଦିବ୍ୟ ମଞ୍ଚ, 
              ଯେଉଁଠାରେ ଭକ୍ତି, ଶ୍ରଦ୍ଧା ଓ ଆତ୍ମିକ ଶାନ୍ତିର ଅନୁଭବ ମିଳେ।
            </p>
          </div>

          {/* 🔗 Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#fbb829] mb-4">
              ଶୀଘ୍ର ଲିଙ୍କ
            </h3>

            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-[#fbb829]">🏠 ମୁଖ୍ୟ ପୃଷ୍ଠା</a></li>
              <li><a href="#about" className="hover:text-[#fbb829]">📖 ଭକ୍ତି ପରିବାର</a></li>
              <li><a href="#events" className="hover:text-[#fbb829]">🎉 ଉତ୍ସବ</a></li>
              <li><a href="#gallery" className="hover:text-[#fbb829]">🖼️ ଗ୍ୟାଲେରୀ</a></li>
            </ul>
          </div>

          {/* 📍 Contact */}
          <div>
            <h3 className="text-lg font-semibold text-[#fbb829] mb-4">
              ସମ୍ପର୍କ
            </h3>

            <div className="space-y-3 text-sm text-white/80">
              <p>📍 ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର, ପୁରୀ, ଓଡ଼ିଶା</p>
              <p>📧 seva@jagannathbhakti.com</p>
              <p>📞 +91 90000 00000</p>
            </div>
          </div>

        </div>

        {/* 🔻 Bottom */}
        <div className="border-t border-red-600 mt-10 pt-6 text-center text-sm text-white/60">

          <div className="flex justify-center mb-4">
            <JagannathLogo size="sm" showGlow={false} />
          </div>

          <p>
            © {currentYear} ଜଗନ୍ନାଥ ଭକ୍ତି ମାର୍ଗ | ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ
          </p>

          <p className="mt-2 text-xs text-[#fbb829]">
            🙏 ଜୟ ଜଗନ୍ନାଥ 🙏
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
