
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
        <p className={"font-bold"}>{"หมายเหตุ: โปรดตรวจสอบสถานะคนขับก่อนเริ่ม"}</p>
      </div>
    ),
    options: {
      'action_needed': {
        title: '1. ร้านยังรอต่อโดยเรียกคนขับใหม่',
        options: {
          'wrong_phone': {
            title: '1. เบอร์โทรลูกค้าผิด/ไม่ครบ', isFinal: true,
            content: <div className={"p-4"}>{"ขอเบอร์ลูกค้ามาใส่ใหม่ หรือใส่เบอร์ร้านแทนแล้วเรียกคนขับใหม่"}</div>
          },
          'no_assign': {
            title: '2. ระบบ ไม่ assign คนขับ',
            options: {
              'store_delivers_no_assign': {
                title: '1. ร้านไปส่งเอง', isFinal: true,
                content: <div className={"p-4"}><p>{"ไปที่ IHD App -> Cancel Driver"}</p><FallbackLogic /></div>
              }
            }
          }
        }
      },
      'cancel_driver': {
        title: '2. ต้องการยกเลิกคนขับ', options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: <div className={"p-4"}><p>{"ยกเลิกใน IHD App"}</p><FallbackLogic /></div>
          }
        }
      }
    }
  },
  'manual-call': {
    title: 'Manually Call a New Driver',
    isFinal: true,
    content: (
      <div className={"bg-white border-pink-500 p-4 rounded-md border-l-4"}>
        <ol className={"list-decimal list-inside space-y-2"}>
          <li>{"สอบถามเลข Order เดิม"}</li>
          <li>{"ไปที่ IHD Admin Panel"}</li>
          <li>{"เลือก Create Order"}</li>
          <li>{"กรอกข้อมูลลูกค้าและยืนยัน"}</li>
        </ol>
      </div>
    )
  }
};
