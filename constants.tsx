import React from 'react';

export const IHD_ADMIN_LINK = (
  <a href={"https://app.inhousedelivery.com/#/live-view"} target={"_blank"} rel={"noopener noreferrer"} className={"text-indigo-600 underline font-semibold"}>
    {"\uD83D\uDC49 IHD Admin Panel"}
  </a>
);

interface StepBoxProps {
  index: number;
  step: string;
  key?: any;
}

function StepBox({ index, step }: StepBoxProps) {
  return (
    <div className={"p-4 bg-white rounded-lg border border-indigo-200 shadow-sm mb-3"}>
      <span className={"text-sm font-bold text-indigo-700"}>{"ขั้นตอน "}{(index + 1)}{":"}</span>
      <p className={"mt-1 text-gray-800"}>{step}</p>
    </div>
  );
}

function FallbackLogic() {
  return (
    <div className={"mt-3 pt-3 border-t border-red-200"}>
      <p className={"font-bold text-red-600 text-xs mb-2"}>{"Note: จะยกเลิกได้ต่อเมื่อสถานะคนขับเป็น a waiting driver หรือ picking up ในระยะแรกๆ"}</p>
      <p className={"font-bold text-green-700 text-xs mb-1"}>{"\uD83D\uDCA1 หากไม่สามารถ Cancel Driver ได้ (Driver กำลังมา):"}</p>
      <ol className={"list-decimal list-inside pl-0 text-xs space-y-1 text-gray-700"}>
        <li>{"ร้านเจรจากับลูกค้าให้รอรับอาหาร"}</li>
        <li>{"ปล่อยคนขับมาถึงร้าน \u2192 แจ้งยกเลิก \u2192 ร้านขอ Refund ค่าส่งจาก CS"}</li>
      </ol>
    </div>
  );
}

export const deliveryFlow: any = {
  'late': {
    title: '1. คนขับมาที่ร้านช้า/ร้านรอคนขับนาน',
    content: (
      <div className={"bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-4"}>
        <p className={"text-sm font-bold text-amber-800"}>{"ตรวจสอบสถานะคนขับก่อนที่: "}{IHD_ADMIN_LINK}</p>
      </div>
    ),
    options: {
      'action_needed': {
        title: 'ร้านยังรอต่อโดยเรียกคนขับใหม่',
        options: {
          'wrong_phone': {
            title: 'เบอร์โทรลูกค้าผิด/ไม่ครบ', isFinal: true,
            content: <div className={"p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded"}>{"ขอเบอร์ลูกค้ามาใส่ใหม่ หรือใช้เบอร์ร้านแทนแล้วกดเรียกคนขับใหม่"}</div>
          },
          'no_assign': {
            title: 'ระบบไม่ assign คนขับ',
            options: {
              'store_delivers_no_assign': {
                title: 'ร้านไปส่งเอง', isFinal: true,
                content: <div className={"p-4 bg-green-50 border-l-4 border-green-500 rounded"}><p>{"ไปที่ IHD App \u2192 Cancel Driver"}</p><FallbackLogic /></div>
              },
              'reassign': {
                title: 'เปลี่ยนเจ้าขนส่ง (Reassign)', isFinal: true,
                content: <div className={"p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded"}>{"ใน IHD Admin \u2192 กดจุด 3 จุดที่ออเดอร์ \u2192 เลือก Reassign order (เช่น เปลี่ยนจาก DoorDash เป็น Uber)"}</div>
              }
            }
          },
          'redispatch': {
            title: 'เรียกคนขับคนใหม่ (Redispatch)', isFinal: true,
            content: (
              <React.Fragment>
                {['ให้ร้านกดเข้าไปที่ออเดอร์ใน IHD App', 'กดจุด 3 จุดมุมบนขวา', 'กด Redispatch Order เพื่อหาคนขับใหม่'].map(function(step, i) {
                  return <StepBox key={i} index={i} step={step} />;
                })}
              </React.Fragment>
            )
          }
        }
      }
    }
  },
  'not-received': {
    title: '2. คนขับนำอาหารไปแล้วแต่ลูกค้าไม่ได้รับ',
    options: {
      'wants_food': {
        title: 'ลูกค้ายังต้องการอาหาร', options: {
          'store_delivers': { 
            title: 'ร้านส่งเอง', isFinal: true, 
            content: <div className={"p-4 bg-green-50 border-l-4 border-green-500 rounded"}>{"ร้านทำอาหารใหม่ส่งเอง + กด Request Refund ใน IHD App เพื่อเคลมค่าอาหาร"}</div>
          },
          'redispatch': {
            title: 'เรียกคนขับใหม่ (Redispatch)', isFinal: true,
            content: <div className={"p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded"}>{"ทำอาหารใหม่ + กด Redispatch ใน IHD + กด Request Refund ออเดอร์เดิมที่หาย"}</div>
          }
        }
      },
      'customer_cancels': {
        title: 'ลูกค้ายกเลิกออเดอร์', isFinal: true,
        content: <div className={"p-4 bg-red-50 border-l-4 border-red-500 rounded"}>{"Cancel ใน LFY App (คืนเงินลูกค้า) และ Request Refund ใน IHD App (ร้านได้เงินชดเชย)"}</div>
      }
    }
  },
  'cancel': {
    title: '3. คนขับยกเลิกออเดอร์',
    options: {
      'before_pickup': {
        title: 'ยกเลิกก่อนรับอาหาร', options: {
          'redispatch': { title: 'เรียกคนใหม่ (Redispatch)', isFinal: true, content: <div className={"p-4"}>{"กด Redispatch Order ทันที"}</div> },
          'store_delivers': { title: 'ร้านส่งเอง', isFinal: true, content: <div className={"p-4"}>{"ร้านนำอาหารไปส่งเอง และ Cancel Driver ในระบบ"}</div> }
        }
      },
      'after_pickup': {
        title: 'ยกเลิกหลังรับอาหารไปแล้ว', options: {
          'wants_food': { title: 'ลูกค้ายังต้องการอาหาร', isFinal: true, content: <div className={"p-4"}>{"ทำอาหารใหม่ + Redispatch + Request Refund ออเดอร์เดิมที่ถูกยกเลิก"}</div> },
          'customer_cancels': { title: 'ลูกค้ายกเลิก', isFinal: true, content: <div className={"p-4"}>{"Cancel ใน LFY App + Request Refund ใน IHD App"}</div> }
        }
      }
    }
  },
  'missing-food': {
    title: '4. อาหารไม่ครบ',
    options: {
      'refund': { title: 'Refund เฉพาะส่วนที่ขาด', isFinal: true, content: <div className={"p-4"}>{"ทำ Partial Refund ผ่าน Stripe ให้ลูกค้าตามมูลค่าของที่ขาด"}</div> },
      'send_missing': {
        title: 'ส่งส่วนที่ขาดตามไป', options: {
          'store_delivers': { title: 'ร้านส่งเอง', isFinal: true, content: <div className={"p-4"}>{"ร้านนำของที่ขาดไปส่งให้ลูกค้าโดยตรง"}</div> },
          'manual_call': { title: 'เรียกคนขับใหม่แบบ Manual', isFinal: true, content: <div className={"p-4"}>{"ไปที่ IHD Admin \u2192 Create Order \u2192 ใส่ราคา $0 \u2192 เรียกคนขับมารับของไปส่ง"}</div> }
        }
      }
    }
  },
  'delivered-no-receive': {
    title: '5. สถานะ Delivered แต่ลูกค้าไม่ได้รับ',
    options: {
      'wait_monitor': { title: 'ให้ลูกค้ารอ/ตรวจสอบรอบบ้าน', isFinal: true, content: <div className={"p-4"}>{"แจ้งลูกค้าให้รอ 5-10 นาที (บางครั้งคนขับกดส่งล่วงหน้า) และเช็คจุดวางของ"}</div> },
      'wants_food': { title: 'ยืนยันไม่ได้รับ (ลูกค้าขออาหาร)', isFinal: true, content: <div className={"p-4"}>{"ทำอาหารใหม่ + Redispatch + Request Refund ออเดอร์เดิม"}</div> },
      'customer_cancels': { title: 'ยืนยันไม่ได้รับ (ลูกค้ายกเลิก)', isFinal: true, content: <div className={"p-4"}>{"Cancel ใน LFY App + Request Refund ใน IHD App"}</div> }
    }
  },
  'manual-call': {
    title: '6. Manually Call a New Driver',
    isFinal: true,
    content: (
      <div className={"bg-white border-pink-500 p-5 rounded-lg border-l-4 shadow-sm"}>
        <h4 className={"font-bold text-pink-700 mb-3"}>{"วิธีการเรียกคนขับด้วยตัวเอง (Manual Order):"}</h4>
        <ol className={"list-decimal list-inside space-y-3 text-sm text-gray-700"}>
          <li>{"ล็อกอินเข้าสู่ IHD Admin Panel"}</li>
          <li>{"ไปที่เมนู 'Create Order'"}</li>
          <li>{"กรอกชื่อ-เบอร์โทร-ที่อยู่ ของลูกค้าให้ถูกต้อง"}</li>
          <li>{"ระบุราคาสินค้าเป็น $0 (เพื่อไม่ให้เก็บเงินซ้ำ)"}</li>
          <li>{"เลือกเจ้าขนส่งที่ต้องการ และกด 'Dispatch'"}</li>
        </ol>
      </div>
    )
  }
};
