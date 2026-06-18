import React, { useState, useEffect } from 'react';
import { getReviews, deleteReview, replyReview } from '../services/reviewService';
import { Trash2, MessageCircle, Star, Reply } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        await deleteReview(id);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Có lỗi xảy ra khi xóa bình luận!');
      }
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await replyReview(replyingTo.id, replyText);
      setReplyingTo(null);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      console.error('Error replying to review:', error);
      alert('Có lỗi xảy ra khi gửi trả lời!');
    }
  };


  return (
    <div className="pb-10 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đánh giá & Bình luận</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">Người dùng</th>
                <th className="py-4 px-6 w-1/4">Bình luận</th>
                <th className="py-4 px-6 w-1/4">Phản hồi của Admin</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Chưa có đánh giá nào.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-500">{review.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {review.product?.productName || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {review.user?.userName || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                        <p className="line-clamp-2 text-sm">{review.comment || <i>Không có nội dung</i>}</p>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {review.createdAt ? new Date(review.createdAt).toLocaleString('vi-VN') : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {review.adminReply ? (
                        <div className="bg-blue-50 p-2 rounded text-sm text-blue-800 border border-blue-100">
                          {review.adminReply}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Chưa phản hồi</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingTo(review);
                            setReplyText(review.adminReply || '');
                          }}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Trả lời"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Trả lời bình luận</h2>
            <div className="mb-4 bg-gray-50 p-3 rounded text-sm text-gray-700">
              <strong>{replyingTo.user?.userName}:</strong> {replyingTo.comment}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Nhập nội dung phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyingTo(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleReplySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
