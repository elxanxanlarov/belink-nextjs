import { PolicyModalData, ContactModalData } from "@/types";

export const authModalData = {
  title: "Belink-ə daxil ol",
  subtitle: "Öz mağazanı yarat və biznesini böyüt.",
  termsPrefix: "",
  termsLink: "Şərtlər və Təhlükəsizlik",
  termsSuffix: "siyasətini oxudum, qəbul edirəm.",
  buttonText: "Google ilə daxil ol",
  errorText: "Zəhmət olmasa şərtləri qəbul edin.",
};

export const termsModalData: PolicyModalData = {
  title: "Şərtlər və Təhlükəsizlik",
  lastUpdated: "Son yenilənmə: Avqust 2026",
  sections: [
    {
      heading: "1. Xidmətdən İstifadə Qaydaları",
      text: "Belink platformasından istifadə edərək bu şərtlərlə tam razılaşmış olursunuz. Platformada qanunsuz, saxta, hüquq pozuntusu yaradan və ya aldadıcı məhsulların paylaşılması qəti qadağandır.",
    },
    {
      heading: "2. Hesab və Giriş Təhlükəsizliyi",
      text: "İstifadəçi hesabının təhlükəsizliyi və məxfiliyi istifadəçinin öz məsuliyyətindədir. Google OAuth vasitəsilə təmin edilən giriş ən yüksək təhlükəsizlik standartlarına əsaslanır.",
    },
    {
      heading: "3. Məhsul və Sifariş Məsuliyyəti",
      text: "Satıcılar öz səhifələrində təqdim etdikləri məhsulların qiyməti, keyfiyyəti və təsvirinin düzgünlüyünə birbaşa cavabdehdirlər. Sifarişlər satıcı və alıcı arasında birbaşa WhatsApp vasitəsilə razılaşdırılır.",
    },
    {
      heading: "4. Məsuliyyətin Məhdudlaşdırılması",
      text: "Belink satıcı və alıcı arasındakı maliyyə əməliyyatlarına və çatdırılma prosesinə birbaşa müdaxilə etmir, sadəcə elektron kataloq və əlaqələndirmə platforması kimi çıxış edir.",
    },
    {
      heading: "5. Qaydaların Yenilənməsi",
      text: "Belink bu qayda və şərtləri istənilən vaxt yeniləmək hüququnu özündə saxlayır. Yenilənmiş şərtlər saytda dərc edildiyi andan qüvvəyə minir.",
    },
  ],
};

export const privacyModalData: PolicyModalData = {
  title: "Məxfilik Siyasəti",
  lastUpdated: "Son yenilənmə: Avqust 2026",
  sections: [
    {
      heading: "1. Məlumatların toplanması",
      text: "Belink platformasına daxil olduğunuzda ad, e-poçt ünvanı və profil şəkli kimi əsas məlumatlarınız Google OAuth vasitəsilə toplanır. Bu məlumatlar yalnız hesabınızı yaratmaq üçün istifadə edilir.",
    },
    {
      heading: "2. Məlumatların istifadəsi",
      text: "Topladığımız məlumatlar yalnız xidmətimizi təqdim etmək, hesabınızı idarə etmək və sizinlə əlaqə saxlamaq məqsədi ilə istifadə olunur. Məlumatlarınız üçüncü şəxslərə satılmır.",
    },
    {
      heading: "3. Cookie-lər",
      text: "Saytımız sessiya məlumatlarını saxlamaq üçün cookie-lərdən istifadə edir. Brauzerin tənzimləmələrindən cookie-ləri istənilən vaxt deaktiv edə bilərsiniz.",
    },
    {
      heading: "4. Məlumat təhlükəsizliyi",
      text: "Məlumatlarınız sənaye standartı şifrələmə protokolları ilə qorunur. Biz məlumatlarınızın təhlükəsizliyini təmin etmək üçün ən müasir texnologiyalardan istifadə edirik.",
    },
    {
      heading: "5. Əlaqə",
      text: "Məxfilik siyasəti ilə bağlı suallarınız üçün support@belink.az ünvanına müraciət edə bilərsiniz.",
    },
  ],
};

export const contactModalData: ContactModalData = {
  title: "Bizimlə Əlaqə",
  subtitle: "Suallarınız, təklifləriniz və ya dəstək üçün bizə yazın.",
  contacts: [
    {
      type: "E-poçt",
      value: "support@belink.az",
      href: "mailto:support@belink.az",
      description: "24 saat ərzində cavablandırılır",
    },
    {
      type: "WhatsApp Dəstək",
      value: "+994 (50) 000-00-00",
      href: "https://wa.me/994500000000",
      description: "Hər gün 09:00 - 21:00",
    },
    {
      type: "İş Saatları",
      value: "Bazar ertəsi - Şənbə",
      description: "09:00 - 18:00",
    },
  ],
};


