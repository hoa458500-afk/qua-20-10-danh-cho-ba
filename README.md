# Web quà 20/10 — bản khởi động nhẹ iPhone v20

V20 chỉ tải khung cảnh và nhạc sau khi người nhận chạm bắt đầu. Màn chào trước đó là HTML/CSS nhẹ, không có canvas, video, vòng vẽ hoặc đồng hồ tải lại. iPhone nhận cấu hình an toàn: giảm canvas còn khoảng 180 nghìn pixel, bỏ filter và will-change trên các lớp lớn, không tạo canvas hạt trang trí bổ sung. Nhạc được mở khóa im lặng trong lần chạm rồi phát từ đầu khi cảnh sẵn sàng. Thông báo sẵn sàng có mã lần phát để lần tải cũ không khởi động nhầm một lần xem lại mới.

Đã bỏ optional chaining, phép gán `||=` và yêu cầu `globalThis` trên trình duyệt; thêm đường lui cho `replaceChildren` và một số chuyển động nếu Web Animations không tồn tại. Toàn bộ 16 script vượt kiểm tra cú pháp ES2018. Kiểm tra mô phỏng bao gồm không tải cảnh/nhạc trước tương tác, mở khóa âm thanh, bấm lặp, bắt tay đúng nguồn, bỏ thông báo lần phát cũ, tải lại khi chậm, chờ bấm nạp năng lượng và giới hạn canvas. Chưa kiểm chứng trên iPhone thật.

V19 nhận diện iPhone/iPad/Android theo thiết bị thay vì chiều rộng iframe cố định 1536px. Trên điện thoại, bật lại cấu hình nhẹ có sẵn, giới hạn canvas khoảng 365 nghìn pixel, giảm nhịp vẽ nền xuống 30 FPS và thay ba bản đồ sao box-shadow rộng 2000px bằng sao gradient. Không tạo thêm iframe hoa 3D trên điện thoại; bó hoa chính và đĩa nhạc vẫn hiển thị. Video cô gái chỉ tải khi đến cảnh nụ cười và dùng ảnh poster nếu trình duyệt không phát được WebM. Mốc nhạc, lời chúc, bố cục ngang và nút nạp năng lượng được giữ nguyên. Kiểm tra cấu hình giả lập thiết bị và cú pháp; chưa xác minh trên iPhone thật.

Bản này giữ bố cục ngang 1536 × 784 của mẫu trong video. Các cảnh sử dụng trình dựng Tiny và tài nguyên tham chiếu: mắt cyan, hoa cỏ và hai cô gái áo dài, bầu sao xanh, hình bàn tay ôm trái tim, cảnh hoa và hoạt ảnh Waguri đang cười.

Bản v17 giữ đầy đủ mở đầu theo video `1000000477.mp4`: “này bà ơi”, đôi mắt thức dậy, KiKi giới thiệu, lời nhắn về nhiệm vụ đặc biệt, rồi chuyển sang cảnh hồng tại giây 9,7 với câu đã chọn “ủa... hôm nay bà rạng rỡ ghê”. Các cảnh đồng cỏ, lời chúc sức khỏe, xinh đẹp và nụ cười được canh theo mốc mở đầu trong video. Ở cảnh nụ cười, giữ cô gái, đĩa nhạc và bó hoa; bỏ các dòng chữ luân phiên bên cạnh cô gái.

Sau đó nối tiếp cỏ bốn lá phát sáng, tặng may mắn, mưa cỏ xanh, đôi mắt hỏi “bà sẵn sàng chưa?”, máy bay chở điều ước, robot chạy trên mặt trăng và lá thư tím. Tiny, cỏ, máy bay và robot dùng lại trình dựng SVG/CSS/JavaScript có sẵn; không nhúng video tham chiếu vào trang.

Nhạc nền là toàn bộ âm thanh nguyên bản từ video `1000000477.mp4`, dài 97,634 giây, tách trực tiếp bằng AAC stream copy. Đoạn nhạc chuyển ở phần mở đầu đã nằm trong bản ghi này; không cắt, đổi tốc độ hoặc chồng thêm một bài khác. Nhạc phát lặp trong lúc chờ và đọc thư.

Trước cảnh chờ nạp năng lượng, thời gian phát nhạc điều khiển các mốc hoạt ảnh, bao gồm mốc chuyển cảnh hồng ở giây 9,7. Đầu trang chờ âm thanh tải xong; khi âm thanh bị chặn hoặc lỗi, hoạt ảnh có thể chạy im lặng. Đến cảnh máy bay, câu chuyện dừng chờ cô ấy bấm **Nạp năng lượng**. Khi bấm, bình năng lượng truyền sang máy bay trong 1,8 giây rồi máy bay mới cất cánh, tiếp tục sang mặt trăng và lá thư. Nhạc vẫn phát khi chờ; thời gian chờ không làm nhảy qua các cảnh sau. Tổng thời lượng câu chuyện phụ thuộc thời điểm cô ấy bấm.

Đĩa vinyl ở góc trái cảnh cuối hiển thị trên cả điện thoại và máy tính, xoay liên tục một vòng mỗi 6,3 giây, cùng kim đĩa và các nốt nhạc.

Lời chúc và câu thoại sử dụng cách xưng hô **bà – tui**.

Ở cảnh nụ cười, một bó hoa hồng xuất hiện từ phía trên góc trái, lơ lửng xuống giữa trong 9 giây rồi đứng lại và nhấp sáng dịu cùng vài ánh sao. Bó hoa mờ đi khi chuyển sang cỏ bốn lá. Bó hoa đồng bộ với đồng hồ hoạt ảnh và bắt đầu lại khi phát lại; chế độ giảm chuyển động hiển thị hoa ở giữa với ánh sáng tĩnh.

Bản v17 làm mềm các lớp chuyển cảnh trong khoảng 1,1 giây, giữ hình cô gái đang phát cho đến khi mờ hết và chuẩn bị trước ảnh, canvas lá cùng hoa trong thư. Chuyển động bó hoa và nạp năng lượng nhận tối đa 60 lần cập nhật mỗi giây thay cho nhịp 70 ms; khi chờ bấm hoặc nhạc đang tải, trang không gửi lặp lại cùng một khung hình. Bình năng lượng dùng lại số đo hình học thay vì đọc kích thước sau mỗi lần cập nhật. Khi mở thư, khung thư giãn chiều cao và nội dung hiện dần.

## Xem

Chạm **Chạm để bắt đầu**. Trên điện thoại, xoay ngang và bấm nút toàn màn hình để xem rõ như video. Nút mũi tên tròn phát lại từ đầu; nút loa bật/tắt nhạc và không làm khởi động lại câu chuyện.

Ở cảnh máy bay, chạm **Nạp năng lượng** một lần để gửi điều ước. Lá thư đã bỏ tiêu đề “Gửi đến bà một chút yêu thương”. Ở cảnh cuối, chạm **Mở lời chúc của tui ♡**, rồi cuộn trong lá thư để đọc hết. Nút **Xem lại câu chuyện** khởi động lại cả hoạt ảnh và âm thanh; cảnh máy bay sẽ lại chờ một lần bấm mới.

## Chạy mã nguồn

Trang sử dụng HTML/CSS/JavaScript thuần, không cần cài thư viện hoặc chạy build. Với bản ZIP đã giải nén, mở thư mục bằng VS Code Live Server, hoặc chạy lệnh sau từ thư mục có `index.html`:

```sh
python3 -m http.server 8000
```

Sau đó mở `http://localhost:8000`. Với checkout dự án, các file công khai nằm trong `dist/`.

`timeline.js` chứa mốc chuyển cảnh; `player.js` điều khiển phát, phát lại, âm thanh và khung hình; `reference-adapter.js` đồng bộ trình dựng cảnh trong `experience.html`. `continuation.js` và `continuation.css` điều khiển phần điều ước và lá thư; `motion.css` điều chỉnh nhịp mờ giữa các cảnh. Ảnh, font và đoạn hoạt ảnh nằm trong `assets/`.

Nguồn và ghi công được lưu trong `THIRD_PARTY_NOTICES.md`; các ghi công có sẵn trong mã tham chiếu được giữ nguyên. Phông chữ Courier Prime có bản quyền đi kèm trong `assets/CourierPrime-OFL.txt`.

Kiểm tra: cú pháp script, tham chiếu tài nguyên, chuỗi mở đầu bằng chính hàm chuyển cảnh gốc, mốc nhạc 9,7 giây, tải nhạc chậm không làm hình chạy trước, yêu cầu phát cũ không ảnh hưởng lần phát lại, đường bay/dừng của bó hoa, cảnh chờ bấm, nhạc tiếp tục khi chờ, chỉ nạp/cất cánh một lần, mở/đọc/phát lại lá thư và khung hình dọc/ngang. Bản nhạc không đổi từ v12, đã xác minh SHA-256 âm thanh giải mã trùng với video gốc. Đã kiểm tra thêm nhịp gửi chuyển động trên màn hình mô phỏng 60/75/90/120/144 Hz, không lặp khung chờ, hình cô gái không tua về đầu lúc rời cảnh, bộ nhớ canvas được dùng lại và 120 bước nạp không đo lại bố cục liên tục. Đây là các kiểm tra tự động mô phỏng DOM; phiên này chưa kiểm tra trực quan hoặc đo FPS trong trình duyệt trên thiết bị thật.
