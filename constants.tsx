
import React from 'react';

export const IHD_ADMIN_LINK = (
  <a href={"https://app.inhousedelivery.com/#/live-view"} target={"_blank"} rel={"noopener noreferrer"} className={"text-indigo-600 underline font-semibold"}>
    {"\uD83D\uDC49 IHD Admin Panel"}
  </a>
);

interface AppNameProps {
  name: string;
  underline?: boolean;
}

function AppName({ name, underline = true }: AppNameProps) {
  const className = underline ? "underline" : "no-underline";
  const isLfy = name.indexOf("Local for you") !== -1;
  const isIhd = name.indexOf("IHD") !== -1;
  const label = isLfy ? "Local for you App" : (isIhd ? "IHD App" : name);
  return <span className={className}>{label}</span>;
}

interface TwoAppBoxesProps {
  box1Title: React.ReactNode;
  box1Content: React.ReactNode;
  box2Title: React.ReactNode;
  box2Content: React.ReactNode;
}

function TwoAppBoxes({ box1Title, box1Content, box2Title, box2Content }: TwoAppBoxesProps) {
  return (
    <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
      <div className={"p-4 bg-indigo-50 rounded-lg border border-indigo-200"}>
        <h4 className={"font-bold text-indigo-700 mb-2 underline"}>{box1Title}</h4>
        {box1Content}
      </div>
      <div className={"p-4 bg-red-50 rounded-lg border border-red-200"}>
        <h4 className={"font-bold text-red-700 mb-2 underline"}>{box2Title}</h4>
        {box2Content}
      </div>
    </div>
  );
}

function FallbackLogic() {
  return (
    <React.Fragment>
      <p className={"mt-3 font-bold text-red-600 text-xs"}>{"Note: จะยกเลิกได้ต่อเมื่อสถานะคนขับเป็น a waiting driver หรือ picking up ในระยะแรกๆ"}</p>
      <div className={"mt-3 pt-3 border-t border-red-200"}>
        <p className={"font-bold text-green-700 text-xs mb-1"}>{"\uD83D\uDCA1 หากไม่สามารถ Cancel Driver ได้ (Driver กำลังมา):"}</p>
        <ol className={"list-decimal list-inside pl-0 text-xs space-y-1"}>
          <li>{"(ตัวเลือก 1) ร้านเจรจากับลูกค้าให้รอรับอาหาร"}</li>
          <li>{"(ตัวเลือก 2) ปล่อยคนขับมาถึงร้าน \u2192 แจ้งยกเลิก \u2192 ร้านขอ Refund ค่าส่งจาก CS"}</li>
        </ol>
      </div>
    </React.Fragment>
  );
}

interface StepBoxProps {
  index: number;
  step: string;
  // Fix: Add optional key property to satisfy TypeScript when used in an array map
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

export const deliveryFlow: any = {
  'late': {
    title: '1. คนขับมาที่ร้านช้า/ร้านรอคนขับนาน',
    content: (
      <div className={"bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-4 text-sm"}>
        <p className={"font-bold"}>{"หมายเหตุ: โปรดตรวจสอบสถานะคนขับที่ "}{IHD_ADMIN_LINK}</p>
      </div>
    ),
    options: {
      'action_needed': {
        title: '1. ร้านยังรอต่อโดยเรียกคนขับใหม่',
        options: {
          'wrong_phone': {
            title: '1. เบอร์โทรลูกค้าผิด/ไม่ครบ', isFinal: true,
            content: <div className={"p-4 bg-white border-l-4 border-indigo-500"}>{"ขอเบอร์ลูกค้ามาใส่ใหม่ หรือใส่เบอร์ร้านแทนแล้วเรียกคนขับใหม่"}</div>
          },
          'no_assign': {
            title: '2. ระบบ ไม่ assign คนขับ',
            options: {
              'store_delivers_no_assign': {
                title: '1. ร้านไปส่งเอง', isFinal: true,
                content: <div className={"p-4 bg-white border-l-4 border-green-500"}><p>{"ไปที่ IHD App \u2192 Cancel Driver"}</p><FallbackLogic /></div>
              },
              'reassign': {
                title: '2. เปลี่ยนคนขับ (Reassign)', isFinal: true,
                content: <div className={"p-4 bg-white border-l-4 border-indigo-500"}>{"ตรวจสอบใน Admin \u2192 กดจุด 3 จุด \u2192 เลือก Reassign order ไปเจ้าอื่น (เช่น Uber)"}</div>
              }
            }
          },
          'redispatch': {
            title: '3. Redispatch (เรียกคนขับคนใหม่)', isFinal: true,
            content: (
              <React.Fragment>
                {['แจ้งร้านให้เรียกคนขับอีกครั้ง', 'ให้ร้านกดเข้าไปที่ออเดอร์นั้นๆ', 'กดจุด 3 จุดมุมบนขวา', 'กด Redispatch Order'].map(function(step, i) {
                  return <StepBox key={i} index={i} step={step} />;
                })}
              </React.Fragment>
            )
          }
        }
      },
      'cancel_driver': {
        title: '2. ต้องการยกเลิกคนขับ',
        options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: <div className={"p-4 bg-white border-l-4 border-green-500"}><p>{"ยกเลิกใน IHD App"}</p><FallbackLogic /></div>
          }
        }
      }
    }
  },
  'not-received': {
    title: '2. คนขับนำอาหารไปแล้วแต่ลูกค้าไม่ได้รับ',
    options: {
      'wants_food': {
        title: '1. ลูกค้าต้องการอาหารอยู่', options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: (
              <TwoAppBoxes 
                box1Title={"ร้านส่งเอง"} 
                box1Content={"ร้านทำอาหารใหม่และนำไปส่งเอง"} 
                box2Title={"IHD Refund"} 
                box2Content={"กด Request Refund ใน IHD App เพื่อขอคืนค่าอาหาร"} 
              />
            )
          },
          'redispatch': {
            title: '2. เรียกคนขับใหม่', isFinal: true,
            content: <div className={"p-4"}>{"กด Redispatch ใน IHD App และกด Request Refund ของออเดอร์เดิมที่หาย"}</div>
          }
        }
      },
      'customer_cancels': {
        title: '2. ลูกค้าต้องการยกเลิก', isFinal: true,
        content: <div className={"p-4"}>{"Cancel Order ใน LFY App (Refund ลูกค้า) และ Request Refund ใน IHD App (Refund ร้าน)"}</div>
      }
    }
  },
  'cancel': {
    title: '3. คนขับยกเลิกออเดอร์',
    options: {
      'before_pickup': {
        title: '1. ยกเลิกก่อนรับอาหาร', options: {
          'redispatch': { title: '1. เรียกคนใหม่ (Redispatch)', isFinal: true, content: <div className={"p-4"}>{"กด Redispatch Order"}</div> },
          'store_delivers': { title: '2. ร้านส่งเอง', isFinal: true, content: <div className={"p-4"}>{"ร้านไปส่งเอง ไม่ต้องกดอะไรเพิ่ม"}</div> }
        }
      },
      'after_pickup': {
        title: '2. ยกเลิกหลังรับอาหารไปแล้ว', options: {
          'wants_food': { title: '1. ลูกค้ายังต้องการอาหาร', isFinal: true, content: <div className={"p-4"}>{"ทำอาหารใหม่ + Redispatch + Request Refund ออเดอร์เดิม"}</div> },
          'customer_cancels': { title: '2. ลูกค้ายกเลิก', isFinal: true, content: <div className={"p-4"}>{"Cancel ใน LFY App + Request Refund ใน IHD App"}</div> }
        }
      }
    }
  },
  'missing-food': {
    title: '4. อาหารไม่ครบ',
    options: {
      'refund': { title: '1. Refund เฉพาะส่วนที่ขาด', isFinal: true, content: <div className={"p-4"}>{"ทำ Partial Refund ผ่าน Stripe ให้ลูกค้า"}</div> },
      'send_missing': {
        title: '2. ส่งส่วนที่ขาดตามไป', options: {
          'store_delivers': { title: '1. ร้านส่งเอง', isFinal: true, content: <div className={"p-4"}>{"ร้านนำของที่ขาดไปส่งเอง"}</div> },
          'manual_call': { title: '2. เรียกคนขับใหม่ (Manual)', isFinal: true, content: <div className={"p-4"}>{"สร้าง Manual Order ใน IHD Admin เพื่อเรียกคนขับมารับของที่ขาด"}</div> }
        }
      }
    }
  },
  'delivered-no-receive': {
    title: '5. สถานะ Delivered แต่ลูกค้าไม่ได้รับ',
    options: {
      'wants_food': { title: '1. ลูกค้าต้องการอาหาร', isFinal: true, content: <div className={"p-4"}>{"ทำอาหารใหม่ + Redispatch + Request Refund ออเดอร์เดิม"}</div> },
      'customer_cancels': { title: '2. ลูกค้ายกเลิก', isFinal: true, content: <div className={"p-4"}>{"Cancel ใน LFY App + Request Refund ใน IHD App"}</div> },
      'wait_monitor': { title: '3. รอ/ติดตามสถานะ', isFinal: true, content: <div className={"p-4"}>{"แจ้งลูกค้าให้รอสักครู่ บางครั้งคนขับกดส่งก่อนถึงจริง"}</div> }
    }
  },
  'manual-call': {
    title: '6. Manually Call a New Driver',
    isFinal: true,
    content: (
      <div className={"bg-white border-pink-500 p-4 rounded-md border-l-4"}>
        <h4 className={"font-bold text-pink-700 mb-2"}>{"ขั้นตอนการเรียกคนขับแบบ Manual:"}</h4>
        <ol className={"list-decimal list-inside space-y-2 text-sm"}>
          <li>{"ไปที่ IHD Admin Panel"}</li>
          <li>{"เลือกเมนู Create Order"}</li>
          <li>{"กรอกข้อมูลลูกค้า (ที่อยู่/เบอร์โทร)"}</li>
          <li>{"ใส่ราคาสินค้า $0 (หากเป็นการส่งซ่อม/ของขาด)"}</li>
          <li>{"กดเรียก Driver มารับที่ร้าน"}</li>
        </ol>
      </div>
    )
  }
};
