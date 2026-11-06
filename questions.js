/* Ngân hàng câu hỏi mở rộng - Mỗi mức độ (Dễ, Trung bình, Khó) đều có từ 9 câu trở lên để phục vụ việc chọn đủ số lượng */
const TOPICS = {
  toan: "Toán học cơ bản",
  code: "Lập trình & Web",
  english: "Tiếng Anh",
  science: "Khoa học tự nhiên",
  history: "Lịch sử Việt Nam",
  geo: "Địa lý",
};

const QUESTION_BANK = {
  toan: [
    // --- Mức 1: Dễ (9 câu) ---
    { lv: 1, q: "15 + 27 bằng bao nhiêu?", o: ["32", "42", "43", "52"], a: 1, e: "15 + 27 = 42." },
    { lv: 1, q: "Diện tích hình chữ nhật dài 8 cm, rộng 5 cm là bao nhiêu?", o: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], a: 2, e: "Diện tích = dài × rộng = 8 × 5 = 40 cm²." },
    { lv: 1, q: "Phân số 3/4 tương ứng với bao nhiêu phần trăm?", o: ["34%", "60%", "75%", "80%"], a: 2, e: "3 ÷ 4 = 0,75 = 75%." },
    { lv: 1, q: "Kết quả của phép tính 100 - 25 × 2 là:", o: ["150", "50", "75", "10"], a: 1, e: "Nhân trước trừ sau: 100 - 50 = 50." },
    { lv: 1, q: "Số nguyên tố nhỏ nhất là số nào?", o: ["0", "1", "2", "3"], a: 2, e: "Số 2 là số nguyên tố chẵn duy nhất và nhỏ nhất." },
    { lv: 1, q: "Kết quả của 7 nhân 8 bằng mấy?", o: ["54", "56", "64", "72"], a: 1, e: "7 × 8 = 56." },
    { lv: 1, q: "Số liền trước của số 100 là:", o: ["98", "99", "101", "102"], a: 1, e: "Số liền trước của 100 là 99." },
    { lv: 1, q: "Một tuần lễ có bao nhiêu ngày?", o: ["5 ngày", "6 ngày", "7 ngày", "8 ngày"], a: 2, e: "Một tuần có 7 ngày." },
    { lv: 1, q: "Gói kẹo có 24 cái, chia đều cho 4 người. Mỗi người được mấy cái?", o: ["4 cái", "5 cái", "6 cái", "8 cái"], a: 2, e: "24 ÷ 4 = 6 cái." },

    // --- Mức 2: Trung bình (9 câu) ---
    { lv: 2, q: "Giải phương trình 2x + 6 = 20. Giá trị của x là:", o: ["5", "6", "7", "10"], a: 2, e: "2x = 14 nên x = 7." },
    { lv: 2, q: "Căn bậc hai số học của 144 là:", o: ["11", "12", "14", "72"], a: 1, e: "12 × 12 = 144." },
    { lv: 2, q: "Chu vi hình tròn bán kính 7 cm (lấy π ≈ 22/7) là:", o: ["22 cm", "44 cm", "49 cm", "154 cm"], a: 1, e: "C = 2πr = 2 × 22/7 × 7 = 44 cm." },
    { lv: 2, q: "Nếu một mặt hàng giảm giá 20% từ giá gốc 500.000đ, giá sau khi giảm là:", o: ["350.000đ", "400.000đ", "450.000đ", "480.000đ"], a: 1, e: "500k - (20% của 500k) = 400.000đ." },
    { lv: 2, q: "Tính giá trị biểu thức: 3² + 4² bằng:", o: ["7", "14", "25", "49"], a: 2, e: "9 + 16 = 25." },
    { lv: 2, q: "Biết 3 quả táo giá 15.000đ. Hỏi 5 quả táo giá bao nhiêu?", o: ["20.000đ", "25.000đ", "30.000đ", "35.000đ"], a: 1, e: "1 quả giá 5.000đ, 5 quả giá 25.000đ." },
    { lv: 2, q: "Số nghiệm của phương trình x² - 4 = 0 là:", o: ["0", "1", "2", "Vô số"], a: 2, e: "x = 2 hoặc x = -2 (2 nghiệm)." },
    { lv: 2, q: "Chuyển phân số 5/2 thành số thập phân ta được:", o: ["2.2", "2.5", "2.8", "5.2"], a: 1, e: "5 chia 2 được 2.5." },
    { lv: 2, q: "Tìm x biết: 3x - 9 = 0", o: ["x = 0", "x = 2", "x = 3", "x = 9"], a: 2, e: "3x = 9 => x = 3." },

    // --- Mức 3: Khó (9 câu) ---
    { lv: 3, q: "Tổng các góc trong của một ngũ giác lồi là:", o: ["360°", "450°", "540°", "720°"], a: 2, e: "Tổng = (n − 2) × 180° = 3 × 180° = 540°." },
    { lv: 3, q: "Đạo hàm của hàm số f(x) = x³ tại x = 2 bằng:", o: ["6", "8", "12", "16"], a: 2, e: "f'(x) = 3x² nên f'(2) = 3 × 4 = 12." },
    { lv: 3, q: "Có bao nhiêu cách xếp 4 người thành một hàng dọc?", o: ["12", "16", "24", "64"], a: 2, e: "Số hoán vị của 4 phần tử là 4! = 24." },
    { lv: 3, q: "Cho cấp số cộng có số hạng đầu u1 = 3 và công sai d = 4. Số hạng thứ 5 (u5) là:", o: ["15", "19", "23", "27"], a: 1, e: "u5 = 3 + (5 - 1) × 4 = 19." },
    { lv: 3, q: "Tích phân từ 0 đến 1 của 2x dx bằng:", o: ["0", "1", "2", "4"], a: 1, e: "Nguyên hàm của 2x là x², thế cận từ 0 đến 1 ra 1." },
    { lv: 3, q: "Số cách chọn ra 2 học sinh từ một nhóm 5 học sinh là:", o: ["5", "10", "20", "25"], a: 1, e: "C(2, 5) = 5! / (2!3!) = 10 cách." },
    { lv: 3, q: "Giá trị nhỏ nhất của hàm số f(x) = x² - 4x + 5 là:", o: ["0", "1", "4", "5"], a: 1, e: "f(x) = (x-2)² + 1 >= 1." },
    { lv: 3, q: "Trong mặt phẳng tọa độ, khoảng cách giữa hai điểm A(1, 2) và B(4, 6) là:", o: ["3", "4", "5", "7"], a: 2, e: "Căn bậc hai của (4-1)² + (6-2)² = căn(9 + 16) = 5." },
    { lv: 3, q: "Số giao điểm của đồ thị hàm số y = x³ - 3x với trục hoành là:", o: ["0", "1", "2", "3"], a: 3, e: "Phương trình x(x² - 3) = 0 có 3 nghiệm phân biệt." }
  ],

  code: [
    // --- Mức 1: Dễ (9 câu) ---
    { lv: 1, q: "HTML là viết tắt của cụm từ nào?", o: ["HyperText Markup Language", "HighText Machine Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], a: 0, e: "HTML là ngôn ngữ đánh dấu siêu văn bản." },
    { lv: 1, q: "Thẻ HTML nào tạo tiêu đề cấp cao nhất?", o: ["<h6>", "<h1>", "<header>", "<title>"], a: 1, e: "<h1> là thẻ tiêu đề lớn nhất." },
    { lv: 1, q: "Ngôn ngữ nào dùng để định kiểu giao diện cho trang web?", o: ["Python", "SQL", "CSS", "Java"], a: 2, e: "CSS quy định bố cục, màu sắc." },
    { lv: 1, q: "Thẻ HTML nào dùng để chèn hình ảnh?", o: ["<img>", "<image>", "<pic>", "<src>"], a: 0, e: "Thẻ <img> dùng để hiển thị ảnh." },
    { lv: 1, q: "Thẻ HTML nào dùng để tạo một liên kết (hyperlink)?", o: ["<link>", "<a>", "<href>", "<url>"], a: 1, e: "Thẻ <a> dùng để tạo liên kết." },
    { lv: 1, q: "Thuộc tính nào trong thẻ <img> dùng để chỉ đường dẫn ảnh?", o: ["href", "link", "src", "alt"], a: 2, e: "Thuộc tính src chứa đường dẫn ảnh." },
    { lv: 1, q: "Đâu là phần mở rộng tiêu chuẩn của một file trang web HTML?", o: [".ht", ".html", ".hweb", ".webs"], a: 1, e: "File HTML có đuôi .html hoặc .htm." },
    { lv: 1, q: "Để tạo một danh sách dạng chấm tròn (unordered list) ta dùng thẻ gì?", o: ["<ol>", "<ul>", "<li>", "<list>"], a: 1, e: "Thẻ <ul> tạo danh sách không thứ tự." },
    { lv: 1, q: "Màu chữ trong CSS được đổi bằng thuộc tính nào?", o: ["font-color", "text-color", "color", "background-color"], a: 2, e: "Thuộc tính color đổi màu chữ." },

    // --- Mức 2: Trung bình (9 câu) ---
    { lv: 2, q: "Khai báo CSS nào bật Flexbox cho một khối?", o: ["position: flex;", "display: flex;", "float: flex;", "flex: block;"], a: 1, e: "display: flex kích hoạt mô hình Flexbox." },
    { lv: 2, q: "Trong JavaScript, từ khóa nào khai báo một hằng số?", o: ["var", "let", "const", "static"], a: 2, e: "const khai báo biến không gán lại giá trị." },
    { lv: 2, q: "Media query nào áp dụng khi chiều rộng màn hình tối đa 768px?", o: ["@media (min-width: 768px)", "@media (max-width: 768px)", "@media (width > 768)", "@screen (768px)"], a: 1, e: "max-width dùng cho thiết bị mobile/tablet." },
    { lv: 2, q: "Phương thức nào thêm phần tử vào cuối mảng trong JavaScript?", o: ["shift()", "unshift()", "push()", "pop()"], a: 2, e: "push() thêm phần tử vào cuối mảng." },
    { lv: 2, q: "Thuộc tính CSS nào dùng để căn chỉnh lề trái/phải cho các phần tử flex theo trục chính?", o: ["align-items", "justify-content", "align-content", "flex-direction"], a: 1, e: "justify-content căn theo trục chính." },
    { lv: 2, q: "Hàm nào trong JavaScript dùng để chuyển chuỗi thành số nguyên?", o: ["Number()", "parseInt()", "toFloat()", "String()"], a: 1, e: "parseInt() dùng phân tích số nguyên." },
    { lv: 2, q: "Trong CSS, bộ chọn nào dùng để nhắm tới một phần tử có id='header'?", o: [".header", "#header", "header", "*header"], a: 1, e: "Dùng dấu # cho id." },
    { lv: 2, q: "Phương thức nào dùng để xóa phần tử cuối cùng của một mảng trong JS?", o: ["pop()", "push()", "shift()", "slice()"], a: 0, e: "pop() loại bỏ phần tử cuối mảng." },
    { lv: 2, q: "Sự kiện nào xảy ra khi người dùng bấm chuột vào một phần tử HTML?", o: ["onhover", "onchange", "onclick", "onkeypress"], a: 2, e: "onclick bắt sự kiện click chuột." },

    // --- Mức 3: Khó (9 câu) ---
    { lv: 3, q: "Thuộc tính CSS nào định nghĩa số cột của Grid?", o: ["grid-columns-set", "column-grid", "grid-template-columns", "grid-flow-column"], a: 2, e: "grid-template-columns quy định các cột." },
    { lv: 3, q: "Kết quả của typeof null trong JavaScript là gì?", o: ['"null"', '"undefined"', '"object"', '"number"'], a: 2, e: 'Đây là lỗi lịch sử: typeof null trả về "object".' },
    { lv: 3, q: "Biểu thức 0.1 + 0.2 === 0.3 trong JavaScript cho kết quả:", o: ["true", "false", "undefined", "Lỗi cú pháp"], a: 1, e: "Sai số dấu phẩy động nhị phân khiến kết quả là false." },
    { lv: 3, q: "Closure trong JavaScript cho phép hàm bên trong truy cập phạm vi của:", o: ["Chỉ hàm toàn cục", "Hàm bên ngoài ngay cả khi đã thực thi", "Chỉ đối tượng con", "Không thể truy cập"], a: 1, e: "Closure ghi nhớ phạm vi hàm bên ngoài." },
    { lv: 3, q: "Event Loop trong JavaScript ưu tiên xử lý hàng đợi nào trước?", o: ["Macrotask Queue", "Microtask Queue", "Timer Queue", "Network Queue"], a: 1, e: "Microtask queue (như Promise) luôn được ưu tiên chạy trước Macrotask." },
    { lv: 3, q: "Phương thức nào của Promise trả về một Promise hoàn thành khi tất cả các Promise thành phần hoàn thành?", o: ["Promise.race()", "Promise.all()", "Promise.any()", "Promise.allSettled()"], a: 1, e: "Promise.all chờ tất cả cùng thành công." },
    { lv: 3, q: "Trong DOM, sự kiện nào kích hoạt trước trong mô hình lan truyền sự kiện (Event Flow)?", o: ["Bubbling phase", "Target phase", "Capturing phase", "Loaded phase"], a: 2, e: "Capturing đi từ ngoài vào trong nên chạy trước." },
    { lv: 3, q: "Cơ chế Hoisting trong JavaScript dịch chuyển khai báo nào lên đầu phạm vi?", o: ["var và function declaration", "chỉ có let và const", "chỉ có arrow function", "không có cơ chế hoisting"], a: 0, e: "var và hàm khai báo thường bị hoisting." },
    { lv: 3, q: "Thuộc tính CSS `box-sizing: border-box` có tác dụng gì?", o: ["Bỏ qua lề padding", "Tính padding và border vào trong tổng width/height", "Chỉ tính nội dung", "Tạo đường viền bóng đổ"], a: 1, e: "border-box giúp kích thước width bao gồm cả padding và border." }
  ],

  english: [
    // --- Mức 1: Dễ (9 câu) ---
    { lv: 1, q: "Chọn đáp án đúng: She ___ a student.", o: ["am", "is", "are", "be"], a: 1, e: "Chủ ngữ số ít đi với is." },
    { lv: 1, q: 'Từ trái nghĩa của "big" là:', o: ["tall", "small", "long", "heavy"], a: 1, e: "Big trái nghĩa với small." },
    { lv: 1, q: 'Dạng số nhiều của "child" là:', o: ["childs", "childrens", "children", "childes"], a: 2, e: "Child dạng bất quy tắc là children." },
    { lv: 1, q: "There are seven days in a ___.", o: ["week", "weak", "work", "walk"], a: 0, e: "Week có nghĩa là tuần." },
    { lv: 1, q: "What is your name? - My name ___ John.", o: ["am", "is", "are", "be"], a: 1, e: "My name là danh từ số ít nên dùng is." },
    { lv: 1, q: "Choose the correct spelling:", o: ["Friend", "Freind", "Frend", "Friand"], a: 0, e: "Friend là cách viết đúng." },
    { lv: 1, q: "I have ___ apple in my bag.", o: ["a", "an", "some", "the"], a: 1, e: "Apple bắt đầu bằng nguyên âm a nên dùng an." },
    { lv: 1, q: "They ___ playing football now.", o: ["is", "am", "are", "be"], a: 2, e: "Chủ ngữ They số nhiều đi với are." },
    { lv: 1, q: "He goes to school ___ foot.", o: ["in", "on", "by", "with"], a: 1, e: "Cố định: on foot (đi bộ)." },

    // --- Mức 2: Trung bình (9 câu) ---
    { lv: 2, q: "I have lived here ___ 2020.", o: ["for", "since", "during", "from"], a: 1, e: "Since dùng với mốc thời gian." },
    { lv: 2, q: "If it rains tomorrow, we ___ at home.", o: ["stay", "will stay", "would stay", "stayed"], a: 1, e: "Câu điều kiện loại 1 dùng will." },
    { lv: 2, q: 'Từ đồng nghĩa với "happy" là:', o: ["sad", "angry", "joyful", "tired"], a: 2, e: "Joyful đồng nghĩa với happy." },
    { lv: 2, q: "She is interested ___ learning foreign languages.", o: ["at", "on", "in", "with"], a: 2, e: "Cấu trúc: interested in." },
    { lv: 2, q: "The book ___ was written by my friend is interesting.", o: ["who", "which", "whom", "where"], a: 1, e: "Dùng which cho vật (the book)." },
    { lv: 2, q: "He speaks English very ___.", o: ["good", "fluent", "fluentness", "fluently"], a: 3, e: "Dùng trạng từ fluently bổ nghĩa cho động từ speaks." },
    { lv: 2, q: "Unless you study hard, you ___ pass the exam.", o: ["will", "won't", "would", "wouldn't"], a: 1, e: "Unless = If not, nghĩa phủ định nên vế sau dùng won't." },
    { lv: 2, q: "Nam is ___ than his brother.", o: ["tall", "taller", "tallest", "more tall"], a: 1, e: "So sánh hơn với tính từ ngắn: taller." },
    { lv: 2, q: "I look forward to ___ you soon.", o: ["see", "seeing", "saw", "seen"], a: 1, e: "Cấu trúc look forward to + V-ing." },

    // --- Mức 3: Khó (9 câu) ---
    { lv: 3, q: "By the time we arrived, the film ___.", o: ["started", "has started", "had started", "was starting"], a: 2, e: "Quá khứ hoàn thành cho hành động xảy ra trước." },
    { lv: 3, q: "She suggested ___ to the cinema.", o: ["go", "to go", "going", "went"], a: 2, e: "Suggest + V-ing." },
    { lv: 3, q: 'Thành ngữ "break the ice" có nghĩa là gì?', o: ["Làm vỡ băng", "Phá vỡ sự ngượng ngùng", "Làm vỡ chiếc cốc", "Trời rất lạnh"], a: 1, e: "Giúp không khí bớt căng thẳng." },
    { lv: 3, q: "Hardly had I opened the front door ___ the phone started ringing.", o: ["when", "than", "then", "suddenly"], a: 0, e: "Cấu trúc đảo ngữ: Hardly ... when." },
    { lv: 3, q: "Not only ___ late, but he also forgot his books.", o: ["he was", "was he", "did he", "he did"], a: 1, e: "Đảo ngữ với Not only ở đầu câu: Not only was he..." },
    { lv: 3, q: "It is essential that he ___ present at the meeting.", o: ["is", "be", "was", "were"], a: 1, e: "Thức giả định (Subjunctive): It is essential that S + V(nguyên mẫu)." },
    { lv: 3, q: "No sooner had we stepped outside ___ it started to pour with rain.", o: ["when", "than", "then", "until"], a: 1, e: "Cấu trúc đảo ngữ: No sooner ... than." },
    { lv: 3, q: "Despite ___ hard, he failed the test.", o: ["studied", "studying", "study", "to study"], a: 1, e: "Despite + V-ing / danh từ." },
    { lv: 3, q: "The manager insisted that the project ___ finished by Friday.", o: ["is", "be", "was", "were"], a: 1, e: "Động từ chỉ sự ra lệnh (insist) đi với thức giả định V nguyên mẫu." }
  ],

  science: [
    // --- Mức 1: Dễ (9 câu) ---
    { lv: 1, q: "Hành tinh nào gần Mặt Trời nhất?", o: ["Sao Kim", "Sao Thủy", "Trái Đất", "Sao Hỏa"], a: 1, e: "Sao Thủy gần nhất." },
    { lv: 1, q: "Nước sôi ở bao nhiêu độ C dưới áp suất tiêu chuẩn?", o: ["50°C", "90°C", "100°C", "120°C"], a: 2, e: "Nước sôi ở 100°C." },
    { lv: 1, q: "Cây xanh hấp thụ khí nào để quang hợp?", o: ["Oxy", "Nitơ", "Cacbon đioxit (CO₂)", "Hiđro"], a: 2, e: "Cây hút CO₂." },
    { lv: 1, q: "Bộ phận nào bơm máu đi nuôi cơ thể?", o: ["Phổi", "Gan", "Tim", "Thận"], a: 2, e: "Tim là máy bơm máu." },
    { lv: 1, q: "Cơ quan nào ở người giúp chúng ta hô hấp (hít thở)?", o: ["Tim", "Phổi", "Dạ dày", "Não"], a: 1, e: "Phổi là cơ quan hô hấp chính." },
    { lv: 1, q: "Lực nào kéo mọi vật rơi xuống mặt đất?", o: ["Lực ma sát", "Lực đẩy Archimedes", "Lực hấp dẫn (trọng lực)", "Lực từ"], a: 2, e: "Trọng lực kéo vạn vật về phía Trái Đất." },
    { lv: 1, q: "Nước ở trạng thái lỏng khi đóng băng sẽ chuyển thành trạng thái gì?", o: ["Khí", "Rắn", "Plasma", "Hơi"], a: 1, e: "Đóng băng thành thể rắn (đá)." },
    { lv: 1, q: "Mặt Trời mọc ở hướng nào và lặn ở hướng nào?", o: ["Đông - Tây", "Tây - Đông", "Nam - Bắc", "Bắc - Nam"], a: 0, e: "Mặt trời mọc hướng Đông, lặn hướng Tây." },
    { lv: 1, q: "Con người thuộc nhóm động vật nào?", o: ["Động vật có vú", "Bò sát", "Lưỡng cư", "Chim"], a: 0, e: "Con người là động vật có vú." },

    // --- Mức 2: Trung bình (9 câu) ---
    { lv: 2, q: "Công thức hóa học của muối ăn là:", o: ["KCl", "NaCl", "CaCO₃", "NaOH"], a: 1, e: "NaCl là muối ăn." },
    { lv: 2, q: "Đơn vị đo lực trong hệ SI là:", o: ["Joule", "Watt", "Newton", "Pascal"], a: 2, e: "Lực đo bằng Newton." },
    { lv: 2, q: "Bộ phận nào của tế bào chứa vật chất di truyền (DNA)?", o: ["Màng tế bào", "Nhân", "Ty thể", "Lục lạp"], a: 1, e: "Nhân chứa DNA." },
    { lv: 2, q: "Khí nào chiếm tỉ lệ lớn nhất trong khí quyển Trái Đất?", o: ["Oxy", "Nitơ", "Cacbon đioxit", "Heli"], a: 1, e: "Nitơ chiếm khoảng 78%." },
    { lv: 2, q: "Hiện tượng nước từ thể lỏng chuyển thành thể hơi gọi là gì?", o: ["Ngưng tụ", "Bay hơi", "Đông đặc", "Thăng hoa"], a: 1, e: "Bay hơi là chuyển từ lỏng sang khí." },
    { lv: 2, q: "pH của dung dịch trung tính (như nước cất) ở điều kiện chuẩn là bao nhiêu?", o: ["0", "7", "14", "5"], a: 1, e: "pH bằng 7 là trung tính." },
    { lv: 2, q: "Vitamin nào sau đây được tổng hợp chủ yếu nhờ ánh nắng mặt trời?", o: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], a: 3, e: "Cơ thể tổng hợp vitamin D khi da tiếp xúc ánh nắng." },
    { lv: 2, q: "Tâm của Hệ Mặt Trời là thiên thể nào?", o: ["Trái Đất", "Mặt Trăng", "Mặt Trời", "Sao Mộc"], a: 2, e: "Mặt Trời là trung tâm hệ." },
    { lv: 2, q: "Kim loại nào ở thể lỏng ở nhiệt độ phòng?", o: ["Sắt", "Đồng", "Thủy ngân", "Nhôm"], a: 2, e: "Thủy ngân (Hg) ở thể lỏng." },

    // --- Mức 3: Khó (9 câu) ---
    { lv: 3, q: "Tốc độ ánh sáng trong chân không xấp xỉ bao nhiêu?", o: ["3 × 10⁵ m/s", "3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s"], a: 2, e: "Khoảng 3 × 10⁸ m/s." },
    { lv: 3, q: "Nguyên tố có số hiệu nguyên tử bằng 6 là:", o: ["Nitơ", "Oxy", "Cacbon", "Bo"], a: 2, e: "Cacbon có số hiệu 6." },
    { lv: 3, q: "Quá trình nào tạo ra phần lớn ATP trong ty thể?", o: ["Quang hợp", "Hô hấp tế bào", "Thẩm thấu", "Phân bào"], a: 1, e: "Hô hấp tế bào tạo ATP." },
    { lv: 3, q: "Hiện tượng khúc xạ ánh sáng xảy ra khi:", o: ["Qua mặt phân cách hai môi trường trong suốt", "Đi trong môi trường đồng tính", "Trong chân không", "Gương phản xạ"], a: 0, e: "Khúc xạ đổi phương tại mặt phân cách." },
    { lv: 3, q: "Hạt mang điện âm trong nguyên tử là:", o: ["Proton", "Neutron", "Electron", "Positron"], a: 2, e: "Electron mang điện tích âm." },
    { lv: 3, q: "Định luật vạn vật hấp dẫn do nhà bác học nào phát hiện?", o: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"], a: 1, e: "Isaac Newton tìm ra định luật vạn vật hấp dẫn." },
    { lv: 3, q: "Liên kết hóa học được hình thành bằng sự dùng chung electron là:", o: ["Liên kết ion", "Liên kết cộng hóa trị", "Liên kết hydro", "Liên kết kim loại"], a: 1, e: "Cộng hóa trị là dùng chung đôi electron." },
    { lv: 3, q: "Phản ứng tỏa nhiệt là phản ứng có:", o: ["Delta H > 0", "Delta H < 0", "Không đổi nhiệt độ", "Hấp thụ nhiệt từ ngoài"], a: 1, e: "Delta H âm biểu thị phản ứng tỏa nhiệt." },
    { lv: 3, q: "Theo thuyết tương đối của Einstein, giới hạn tốc độ tối đa trong vũ trụ là gì?", o: ["Tốc độ âm thanh", "Tốc độ ánh sáng trong chân không", "Tốc độ quay Trái Đất", "Vận tốc escape"], a: 1, e: "Không vật chất nào vượt quá tốc độ ánh sáng." }
  ],

  history: [
    // --- Mức 1: Dễ (9 câu) ---
    { lv: 1, q: "Quốc khánh nước CHXHCN Việt Nam là ngày nào?", o: ["30/4", "2/9", "19/5", "1/5"], a: 1, e: "Ngày 2/9/1945." },
    { lv: 1, q: "Vị vua đầu tiên của nhà Nguyễn là ai?", o: ["Gia Long", "Minh Mạng", "Tự Đức", "Bảo Đại"], a: 0, e: "Nguyễn Ánh lấy niên hiệu Gia Long." },
    { lv: 1, q: "Ai đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình năm 1945?", o: ["Võ Nguyên Giáp", "Phạm Văn Đồng", "Hồ Chí Minh", "Trường Chinh"], a: 2, e: "Chủ tịch Hồ Chí Minh." },
    { lv: 1, q: "Triều đại nào xây dựng Văn Miếu - Quốc Tử Giám?", o: ["Nhà Lý", "Nhà Trần", "Nhà Lê", "Nhà Nguyễn"], a: 0, e: "Nhà Lý xây dựng." },
    { lv: 1, q: "Chiến dịch Hồ Chí Minh lịch sử giải phóng miền Nam kết thúc vào năm nào?", o: ["1954", "1972", "1975", "1979"], a: 2, e: "Ngày 30/4/1975 giải phóng miền Nam." },
    { lv: 1, q: "Thủ đô của nước Văn Lang (nhà nước đầu tiên của Việt Nam) đặt ở đâu?", o: ["Cổ Loa", "Bạch Hạc (Phú Thọ)", "Hoa Lư", "Thăng Long"], a: 1, e: "Văn Lang đóng đô ở Phong Châu - Phú Thọ." },
    { lv: 1, q: "Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn chống giặc Minh?", o: ["Trần Hưng Đạo", "Lê Lợi", "Nguyễn Trãi", "Quang Trung"], a: 1, e: "Lê Lợi là lãnh tụ khởi nghĩa Lam Sơn." },
    { lv: 1, q: "Ngày giải phóng thủ đô Hà Nội là ngày nào?", o: ["10/10/1954", "07/05/1954", "02/09/1945", "30/04/1975"], a: 0, e: "Ngày 10/10/1954 tiếp quản thủ đô." },
    { lv: 1, q: "Bác Hồ sinh ra ở tỉnh nào?", o: ["Nghệ An", "Hà Tĩnh", "Thanh Hóa", "Quảng Bình"], a: 0, e: "Bác sinh tại làng Sen, Nam Đàn, Nghệ An." },

    // --- Mức 2: Trung bình (9 câu) ---
    { lv: 2, q: "Chiến thắng Bạch Đằng năm 938 do ai chỉ huy?", o: ["Lê Hoàn", "Ngô Quyền", "Trần Hưng Đạo", "Đinh Bộ Lĩnh"], a: 1, e: "Ngô Quyền chỉ huy." },
    { lv: 2, q: "Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào năm nào?", o: ["1945", "1950", "1954", "1975"], a: 2, e: "Ngày 7/5/1954." },
    { lv: 2, q: "Kinh đô Đại Cồ Việt thời nhà Đinh đặt ở đâu?", o: ["Thăng Long", "Hoa Lư", "Phú Xuân", "Cổ Loa"], a: 1, e: "Đóng đô ở Hoa Lư." },
    { lv: 2, q: "Khởi nghĩa Hai Bà Trưng nổ ra vào năm nào?", o: ["40 SCN", "938 SCN", "1075 SCN", "1789 SCN"], a: 0, e: "Năm 40 SCN." },
    { lv: 2, q: "Nhà Trần đã 3 lần đánh bại quân xâm lược nào?", o: ["Mông - Nguyên", "Nam Hán", "Tống", "Thanh"], a: 0, e: "Nhà Trần 3 lần thắng quân Nguyên - Mông." },
    { lv: 2, q: "Ai là tác giả của tác phẩm 'Bình Ngô đại cáo'?", o: ["Trần Hưng Đạo", "Nguyễn Trãi", "Lê Lợi", "Hồ Quý Ly"], a: 1, e: "Nguyễn Trãi soạn Bình Ngô đại cáo." },
    { lv: 2, q: "Đảng Cộng sản Việt Nam được thành lập vào ngày tháng năm nào?", o: ["03/02/1930", "02/09/1945", "19/05/1890", "19/12/1946"], a: 0, e: "Thành lập ngày 3/2/1930." },
    { lv: 2, q: "Cuộc phản công ở kinh thành Huế đánh dấu phong trào nào bùng nổ?", o: ["Cần Vương", "Đông Kinh Nghĩa Thục", "Duy Tân", "Yên Thế"], a: 0, e: "Phong trào Cần Vương (1885)." },
    { lv: 2, q: "Vị vua nào của nhà Lý đã dời đô từ Hoa Lư về Thăng Long?", o: ["Lý Thái Tổ", "Lý Thánh Tông", "Lý Nhân Tông", "Lý Thái Tông"], a: 0, e: "Lý Thái Tổ (Lý Công Uẩn) dời đô năm 1010." },

    // --- Mức 3: Khó (9 câu) ---
    { lv: 3, q: "Nhà Hồ do ai sáng lập và vào năm nào?", o: ["1010", "1225", "1400", "1428"], a: 2, e: "Hồ Quý Ly lập nhà Hồ năm 1400." },
    { lv: 3, q: "Hiệp định Paris về Việt Nam được ký kết năm nào?", o: ["1968", "1973", "1975", "1976"], a: 1, e: "Ký ngày 27/1/1973." },
    { lv: 3, q: "Chiếu dời đô năm 1010 do vị vua nào ban hành?", o: ["Lý Thái Tổ", "Lý Thánh Tông", "Trần Thái Tông", "Lê Thái Tổ"], a: 0, e: "Lý Công Uẩn (Lý Thái Tổ)." },
    { lv: 3, q: "Chiến thắng Ngọc Hồi - Đống Đa 1789 do ai lãnh đạo?", o: ["Nguyễn Huệ", "Nguyễn Nhạc", "Nguyễn Lữ", "Trần Hưng Đạo"], a: 0, e: "Quang Trung - Nguyễn Huệ." },
    { lv: 3, q: "Hội nghị thành lập Đảng Cộng sản Việt Nam đầu năm 1930 diễn ra ở đâu?", o: ["Hà Nội", "Hương Cảng (Trung Quốc)", "Cao Bằng", "Sài Gòn"], a: 1, e: "Diễn ra tại Cửu Long, Hương Cảng dưới sự chủ trì của Nguyễn Ái Quốc." },
    { lv: 3, q: "Triều đại phong kiến nào ở Việt Nam có thời gian tồn tại ngắn nhất?", o: ["Nhà Hồ", "Nhà Tây Sơn", "Nhà Triệu", "Nhà Nhà Ngô"], a: 0, e: "Nhà Hồ tồn tại từ 1400 đến 1407 (7 năm)." },
    { lv: 3, q: "Người trực tiếp cắm cờ trên nóc dinh Độc Lập ngày 30/4/1975 là ai?", o: ["Bùi Văn Thận", "Phạm Xuân Thềm", "Vũ Thăng", "Nguyễn Văn Tập"], a: 0, e: "Đồng chí Bùi Văn Thận cắm cờ trên dinh Độc Lập." },
    { lv: 3, q: "Chiến dịch Biên giới thu đông diễn ra vào năm nào?", o: ["1947", "1950", "1952", "1953"], a: 1, e: "Chiến dịch Biên giới diễn ra năm 1950." },
    { lv: 3, q: "Bộ luật nào được coi là bộ luật thành văn đầu tiên có quy mô lớn của phong kiến Việt Nam?", o: ["Hình thư", "Bộ luật Hồng Đức", "Bộ luật Gia Long", "Hoàng Việt luật lệ"], a: 0, e: "Hình thư thời nhà Lý (năm 1042) là bộ luật thành văn đầu tiên." }
  ],

  geo: [
    // --- Mức 1: Dễ (9 câu) ---
    { lv: 1, q: "Thủ đô của Việt Nam là thành phố nào?", o: ["Huế", "Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh"], a: 1, e: "Hà Nội." },
    { lv: 1, q: "Đại dương nào lớn nhất thế giới?", o: ["Đại Tây Dương", "Thái Bình Dương", "Ấn Độ Dương", "Bắc Băng Dương"], a: 1, e: "Thái Bình Dương." },
    { lv: 1, q: "Châu lục nào có diện tích lớn nhất?", o: ["Châu Phi", "Châu Mỹ", "Châu Á", "Châu Âu"], a: 2, e: "Châu Á." },
    { lv: 1, q: "Việt Nam giáp với quốc gia nào ở phía Tây?", o: ["Trung Quốc", "Lào và Campuchia", "Thái Lan", "Malaysia"], a: 1, e: "Giáp Lào và Campuchia." },
    { lv: 1, q: "Tỉnh/thành phố nào ở nước ta có diện tích lớn nhất?", o: ["Hà Nội", "Nghệ An", "Gia Lai", "Đắk Lắk"], a: 1, e: "Nghệ An là tỉnh có diện tích lớn nhất Việt Nam." },
    { lv: 1, q: "Nước ta có hình chữ gì trên bản đồ thế giới?", o: ["Hình chữ S", "Hình chữ C", "Hình chữ L", "Hình chữ V"], a: 0, e: "Việt Nam cong hình chữ S." },
    { lv: 1, q: "Đảo lớn nhất của nước ta là đảo nào?", o: ["Đảo Phú Quốc", "Đảo Cát Bà", "Đảo Lý Sơn", "Đảo Phú Quý"], a: 0, e: "Phú Quốc là đảo lớn nhất." },
    { lv: 1, q: "Sông nào dài nhất chảy qua lãnh thổ Việt Nam ở phía Nam?", o: ["Sông Hồng", "Sông Đà", "Sông Mekong (Cửu Long)", "Sông Mã"], a: 2, e: "Sông Cửu Long chảy qua miền Nam." },
    { lv: 1, q: "Khí hậu nước ta mang tính chất gì chủ đạo?", o: ["Ôn đới lạnh", "Nhiệt đới gió mùa", "Hàn đới", "Hoang mạc khô hạn"], a: 1, e: "Khí hậu nhiệt đới gió mùa ẩm." },

    // --- Mức 2: Trung bình (9 câu) ---
    { lv: 2, q: "Đỉnh núi cao nhất Việt Nam là:", o: ["Ngọc Linh", "Phan Xi Păng", "Bạch Mã", "Tam Đảo"], a: 1, e: "Phan Xi Păng." },
    { lv: 2, q: "Sa mạc Sahara nằm ở châu lục nào?", o: ["Châu Á", "Châu Phi", "Châu Mỹ", "Châu Đại Dương"], a: 1, e: "Bắc Phi." },
    { lv: 2, q: "Quốc gia nào có diện tích lớn nhất thế giới?", o: ["Canada", "Trung Quốc", "Nga", "Hoa Kỳ"], a: 2, e: "Nga." },
    { lv: 2, q: "Sông Mekong chảy qua bao nhiêu quốc gia trước khi ra biển?", o: ["4 quốc gia", "5 quốc gia", "6 quốc gia", "7 quốc gia"], a: 2, e: "6 quốc gia." },
    { lv: 2, q: "Vịnh Hạ Long nằm ở tỉnh/thành phố nào của nước ta?", o: ["Hải Phòng", "Quảng Ninh", "Nam Định", "Thái Bình"], a: 1, e: "Vịnh Hạ Long thuộc Quảng Ninh." },
    { lv: 2, q: "Đường bờ biển của Việt Nam dài khoảng bao nhiêu km?", o: ["1.500 km", "2.200 km", "3.260 km", "4.500 km"], a: 2, e: "Bờ biển dài khoảng 3.260 km." },
    { lv: 2, q: "Thành phố nào được mệnh danh là 'Thành phố ngàn hoa' ở Việt Nam?", o: ["Đà Lạt", "Sa Pa", "Nha Trang", "Buôn Ma Thuột"], a: 0, e: "Đà Lạt (Lâm Đồng)." },
    { lv: 2, q: "Loại hình thời tiết đặc trưng gây mưa lớn miền Trung nước ta vào cuối năm là gì?", o: ["Bão và áp thấp kết hợp gió mùa Đông Bắc", "Gió Tây khô nóng", "Tuyết rơi", "Sương mù"], a: 0, e: "Bão kết hợp gió mùa và dải hội tụ." },
    { lv: 2, q: "Hồ nước ngọt lớn nhất ở khu vực Tây Nguyên là hồ nào?", o: ["Hồ Ba Bể", "Hồ T’Nưng (Biển Hồ)", "Hồ Tây", "Hồ Dầu Tiếng"], a: 1, e: "Hồ T'Nưng ở Pleiku, Gia Lai." },

    // --- Mức 3: Khó (9 câu) ---
    { lv: 3, q: "Eo biển nào ngăn cách châu Âu và châu Phi ở lối vào Địa Trung Hải?", o: ["Eo biển Malacca", "Eo biển Gibraltar", "Eo biển Bering", "Eo biển Hormuz"], a: 1, e: "Eo biển Gibraltar." },
    { lv: 3, q: "Đường xích đạo không đi qua châu lục nào sau đây?", o: ["Châu Phi", "Châu Mỹ", "Châu Âu", "Châu Á"], a: 2, e: "Không đi qua châu Âu." },
    { lv: 3, q: "Vùng biển nào có độ mặn cao nhất, dễ nổi trên mặt nước?", o: ["Biển Đỏ", "Biển Chết", "Biển Đen", "Biển Đông"], a: 1, e: "Biển Chết." },
    { lv: 3, q: "Kênh đào nào nối liền Đại Tây Dương và Thái Bình Dương, cắt ngang Trung Mỹ?", o: ["Kênh đào Suez", "Kênh đào Panama", "Kênh đào Kiel", "Kênh đào Corinth"], a: 1, e: "Kênh đào Panama." },
    { lv: 3, q: "Điểm cực Bắc phần đất liền của nước ta thuộc tỉnh nào?", o: ["Hà Giang", "Lào Cai", "Cao Bằng", "Lạng Sơn"], a: 0, e: "Xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang." },
    { lv: 3, q: "Dãy núi nào đóng vai trò là ranh giới tự nhiên chính giữa khí hậu miền Bắc và miền Nam?", o: ["Dãy Hoàng Liên Sơn", "Dãy Trường Sơn Bắc", "Dãy Bạch Mã", "Dãy Hoành Sơn"], a: 2, e: "Dãy Bạch Mã chắn gió mùa đông bắc tạo ranh giới." },
    { lv: 3, q: "Quần đảo Hoàng Sa hiện đang trực thuộc sự quản lý hành chính của thành phố/tỉnh nào?", o: ["Đà Nẵng", "Khánh Hòa", "Quảng Ngãi", "Bình Định"], a: 0, e: "Hoàng Sa trực thuộc TP. Đà Nẵng." },
    { lv: 3, q: "Lực nào làm lệch hướng chuyển động của các vật thể (như gió, dòng biển) trên Trái Đất?", o: ["Lực hướng tâm", "Lực Coriolis", "Lực ma sát", "Lực đẩy"], a: 1, e: "Lực Coriolis do Trái Đất tự quay." },
    { lv: 3, q: "Châu lục nào lạnh nhất và khô nhất trên Trái Đất?", o: ["Châu Âu", "Châu Nam Cực", "Bắc Mỹ", "Châu Đại Dương"], a: 1, e: "Châu Nam Cực (Antarctica)." }
  ]
};