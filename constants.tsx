import React from 'react';

// Use Unicode escapes for all special characters to prevent JSX parsing errors
export const IHD_ADMIN_LINK = (
  <a href={"https://app.inhousedelivery.com/#/live-view"} target={"_blank"} rel={"noopener noreferrer"} className={"text-indigo-600 underline font-semibold"}>
    {"\uD83D\uDC49 IHD Admin Panel"}
  </a>
);

const AppName: React.FC<{ name: string; underline?: boolean }> = ({ name, underline = true }) => {
  const className = underline ? "underline" : "no-underline";
  const label = name.includes("Local for you") ? "Local for you App" : name.includes("IHD") ? "IHD App" : name;
  return <span className={className}>{label}</span>;
};

const TwoAppBoxes: React.FC<{ box1Title: React.ReactNode; box1Content: React.ReactNode; box2Title: React.ReactNode; box2Content: React.ReactNode }> = ({ box1Title, box1Content, box2Title, box2Content }) => {
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
};

const FallbackLogic: React.FC = () => {
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
      <div className={"mt-4 p-3 bg-gray-50 border-l-4 border-gray-400 rounded-lg text-xs text-gray-700"}>
        <p className={"font-bold mb-1 text-gray-800"}>{"รายละเอียดเพิ่มเติมสำหรับตัวเลือกที่ 2 (กรณีไม่สามารถยกเลิก Driver ได้):"}</p>
        <p>{"ทางร้านควรปล่อยให้ Driver มาที่ร้านตามปกติ จากนั้นแจ้ง Driver ว่าออเดอร์ถูกยกเลิกไปแล้ว และทำเรื่องขอ Refund ค่าคนขับมาทาง CS ด้วยเหตุผล: \"รอคนขับมารับอาหารที่ร้านนาน ลูกค้ายกเลิกออเดอร์แล้ว ขอ Refund ค่าส่งที่เรียกคนขับมาและคนขับมาข้า\""}</p>
      </div>
    </React.Fragment>
  );
};

const StepBox: React.FC<{ index: number; step: string }> = ({ index, step }) => {
  return (
    <div className={"p-4 bg-white rounded-lg border border-indigo-200 shadow-sm mb-3"}>
      <span className={"text-sm font-bold text-indigo-700"}>{"ขั้นตอน "}{index + 1}{":"}</span>
      <p className={"mt-1 text-gray-800"}>{step}</p>
    </div>
  );
};

export const deliveryFlow: any = {
  'late': {
    title: '1. คนขับมาที่ร้านช้า/ร้านรอคนขับนาน',
    content: (
      <div className={"bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-4 text-sm"}>
        <p className={"font-bold"}>{"หมายเหตุ:"}</p>
        <p>{"*คนขับอยู่สถานะไหนโดยการสอบถามทางร้านหรือเข้าไปที่ "}{IHD_ADMIN_LINK}</p>
      </div>
    ),
    options: {
      'action_needed': {
        title: '1. ร้านยังรอต่อโดยเรียกคนขับใหม่',
        options: {
          'wrong_phone': {
            title: '1. เบอร์โทรลูกค้าผิด/ไม่ครบ', isFinal: true,
            content: (
              <div className={"bg-white border-indigo-500 p-4 rounded-md border-l-4"}>
                <ol className={"list-decimal list-inside space-y-2"}>
                  <li>{"ขอเบอร์ลูกค้ามาใส่ใหม่"}</li>
                  <li>{"หากทำไม่ได้ให้ใส่เบอร์ร้านแทน"}</li>
                  <li>{"เรียกคนขับ"}</li>
                </ol>
              </div>
            )
          },
          'no_assign': {
            title: '2. ระบบ ไม่ assign คนขับ',
            options: {
              'store_delivers_no_assign': {
                title: '1. ร้านไปส่งเอง', isFinal: true,
                content: (
                  <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>
                    <ol className={"list-decimal list-inside"}>
                      <li>{"ไปที่ "}<AppName name={"IHD App"} underline={false} /></li>
                      <li>{"เลือกออเดอร์นั้นๆ"}</li>
                      <li>{"กดจุด 3 จุดมุมขวา"}</li>
                      <li>{"Cancel Driver"}</li>
                    </ol>
                    <FallbackLogic />
                  </div>
                )
              },
              'reassign_driver': {
                title: '2. เปลี่ยนคนขับ (Reassign)', isFinal: true,
                content: (
                  <div className={"bg-white border-indigo-500 p-4 rounded-md border-l-4"}>
                    <ol className={"list-decimal list-inside space-y-2"}>
                      <li>{"ตรวจสอบใน "}{IHD_ADMIN_LINK}{" ว่าออเดอร์อยู่ในสถานะ \"Searching\" หรือไม่"}</li>
                      <li>{"Reassign order หากหาคนขับจาก doordash ไม่ได้"}</li>
                      <li>{"Reassign ไปที่ uber (เลือกออเดอร์ \u2192 กดจุด 3 จุดมุมขวาบน \u2192 เลือก "}<strong>{"reassign order"}</strong>{")"}</li>
                    </ol>
                  </div>
                )
              }
            }
          },
          'payment_update': {
            title: '3. Need payment update',
            options: {
              'update_for_them': {
                title: '1. ให้ร้านบอกเลขบัตรมาให้เราอัพเดทให้',
                isFinal: true,
                content: (
                  <div className={"bg-white border-indigo-500 p-4 rounded-md border-l-4"}>
                    <ol className={"list-decimal list-inside space-y-2"}>
                      <li>{"ขอข้อมูลเลขบัตรเครดิต/เดบิต, วันหมดอายุ และ CVV จากร้านค้า"}</li>
                      <li>{"นำข้อมูลไปอัปเดตในระบบ Stripe หรือ Portal ที่เกี่ยวข้อง"}</li>
                      <li>{"เมื่ออัปเดตสำเร็จ แจ้งร้านให้กดเรียกคนขับ (Redispatch) ใหม่อีกครั้ง"}</li>
                    </ol>
                  </div>
                )
              },
              'update_by_themselves': {
                title: '2. ร้านต้องการอัพเดทบัตรด้วยตัวเอง',
                isFinal: true,
                content: (
                  <div className={"bg-white border-indigo-500 p-4 rounded-md border-l-4"}>
                    <ol className={"list-decimal list-inside space-y-2"}>
                      <li>{"แจ้งร้านค้าตรวจสอบการเชื่อมต่อบัตรเครดิต/เดบิตในระบบ Stripe"}</li>
                      <li>{"ตรวจสอบยอดเงินในบัญชีที่ใช้ตัดค่าส่ง หรือเช็คว่าบัตรหมดอายุหรือไม่"}</li>
                      <li>{"เมื่ออัปเดตข้อมูลการชำระเงินเรียบร้อยแล้ว ให้กดเรียกคนขับใหม่อีกครั้ง"}</li>
                    </ol>
                  </div>
                )
              }
            }
          },
          'redispatch_steps': { 
            title: '4. ร้านยังรอต่อโดยเรียกคนขับใหม่', isFinal: true, 
            content: (
              <React.Fragment>
                {['แจ้งร้านให้เรียกคนขับอีกครั้ง', 'ให้ร้านกดเข้าไปที่ออเดอร์นั้นๆ', 'กดจุด 3 จุดมุมบนขวา', 'กด Redispatch Order'].map((step, i) => {
                  return <StepBox key={i} index={i} step={step} />;
                })}
              </React.Fragment>
            )
          }
        }
      },
      'cancel_driver': {
        title: '2. ต้องการยกเลิกคนขับ', options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: (
              <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>
                <ol className={"list-decimal list-inside"}>
                  <li>{"ไปที่ "}<AppName name={"IHD App"} underline={false} /></li>
                  <li>{"เลือกออเดอร์นั้นๆ"}</li>
                  <li>{"กดจุด 3 จุดมุมขวา"}</li>
                  <li>{"Cancel Driver"}</li>
                </ol>
                <FallbackLogic />
              </div>
            )
          },
          'customer_refund': { 
            title: '2. ลูกค้าไม่ต้องการ Order แล้วต้องการ Refund', isFinal: true, 
            content: (
              <React.Fragment>
                <TwoAppBoxes 
                  box1Title={<AppName name={"IHD App"} />} 
                  box1Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ Application"}</li><li>{"เลือกออเดอร์นั้นๆ"}</li><li>{"กดจุด 3 จุดมุมขวา"}</li><li>{"Cancel Driver"}</li></ol><FallbackLogic /></React.Fragment>} 
                  box2Title={<AppName name={"Local for you App"} />} 
                  box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ Application restaurant order-taking app (Local for you)"}</li><li>{"เลือกออเดอร์นั้นๆที่ต้องการ Refund"}</li><li>{"กดจุดสามจุดมุมขวาล่าง"}</li><li>{"กด Cancel order"}</li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}</p></React.Fragment>} 
                />
                <div className={"mt-4 p-3 bg-gray-50 border-l-4 border-gray-400 rounded-lg text-xs text-gray-700"}>
                  <p className={"font-bold mb-1 text-gray-800"}>{"รายละเอียดเพิ่มเติมสำหรับตัวเลือกที่ 2 (กรณีไม่สามารถยกเลิก Driver ได้):"}</p>
                  <p>{"ทางร้านควรปล่อยให้ Driver มาที่ร้านตามปกติ จากนั้นแจ้ง Driver ว่าออเดอร์ถูกยกเลิกไปแล้ว และทำเรื่องขอ Refund ค่าคนขับมาทาง CS ด้วยเหตุผล: \"รอคนขับมารับอาหารที่ร้านนาน ลูกค้ายกเลิกออเดอร์แล้ว ขอ Refund ค่าส่งที่เรียกคนขับมาและคนขับมาข้า\""}</p>
                </div>
              </React.Fragment>
            )
          }
        }
      }
    }
  },
  'not-received': {
    title: '2. คนขับนำอาหารไปแล้วแต่ลูกค้าไม่ได้รับ', 
    content: (
      <div className={"bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-4 text-sm"}>
        <p className={"font-bold"}>{"หมายเหตุ:"}</p>
        <p>{"*คนขับอยู่สถานะไหนโดยการสอบถามทางร้านหรือเข้าไปที่ "}{IHD_ADMIN_LINK}</p>
      </div>
    ),
    options: {
      'wants_food': {
        title: '1. ลูกค้าต้องการอาหารอยู่', options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: (
              <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                <div className={"p-4 bg-white rounded-lg border border-indigo-200 shadow-sm"}>
                  <h4 className={"font-bold text-indigo-700 mb-2"}>{"ร้านอาหาร (การจัดส่งใหม่)"}</h4>
                  <ol className={"list-decimal list-inside"}><li>{"ร้านทำอาหารใหม่"}</li><li>{"นำออเดอร์ไปส่งลูกค้าเอง"}</li></ol>
                </div>
                <div className={"p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm"}>
                  <h4 className={"font-bold text-red-700 mb-2 underline"}><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่หายไป)"}</h4>
                  <ol className={"list-decimal list-inside"}><li>{"เลือกออเดอร์เดิมที่เสียหายไป"}</li><li>{"กดจุด 3 จุดมุมขวาบน"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol>
                  <p className={"mt-2 text-sm text-green-700 font-semibold"}>{"เพื่อขอคืนค่าอาหารที่หายจากออเดอร์ก่อนหน้า"}</p>
                </div>
              </div>
            )
          },
          'lfy_redispatch': { 
            title: '2. Local for you หา Driver ให้อีกครั้ง', isFinal: true, 
            content: (
              <TwoAppBoxes 
                box1Title={<React.Fragment><AppName name={"IHD App"} /> {"(เรียกคนขับใหม่)"}</React.Fragment>} 
                box1Content={<ol className={"list-decimal list-inside"}><li>{"แจ้งร้านให้เรียกคนขับอีกครั้ง"}</li><li>{"ให้ร้านกดเข้าไปที่ออเดอร์เดิมที่เกิดปัญหา ใน "}<AppName name={"IHD App"} underline={false} /></li><li>{"กดจุด 3 จุดมุมบนขวา"}</li><li>{"กด "}<strong>{"Redispatch Order"}</strong></li></ol>} 
                box2Title={<React.Fragment><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่หายไป)"}</React.Fragment>} 
                box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"เลือกออเดอร์เดิมที่ต้องการเงินคืน"}</li><li>{"กดจุด 3 จุดมุมขวาบน"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}</p></React.Fragment>} 
              /> 
            )
          }
        }
      },
      'customer_cancels': {
        title: '2. ลูกค้าต้องการยกเลิกออเดอร์', isFinal: true, 
        content: (
          <TwoAppBoxes
            box1Title={<React.Fragment><AppName name={"Local for you App"} /> {"(Refund ลูกค้า)"}</React.Fragment>}
            box1Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ Application restaurant order-taking app (Local for you)"}</li><li>{"เลือกออเดอร์นั้นๆที่ต้องการ Refund"}</li><li>{"กดจุดสามจุดมุมขวาล่าง"}</li><li>{"กด Cancel order"}</li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}</p></React.Fragment>}
            box2Title={<React.Fragment><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่เสียหายไป)"}</React.Fragment>}
            box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ IHD App"}</li><li>{"เลือกออเดอร์นั้นๆ"}</li><li>{"กดจุด 3 จุดมุมขวา"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่เสียหายไป)"}</p></React.Fragment>} 
          />
        )
      },
      'wait_monitor': { 
        title: '3. รอต่อไป', isFinal: true, 
        content: (
          <React.Fragment>
            <div className={"bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mb-4 text-sm"}>
              <p className={"font-bold text-blue-700"}>{"ดำเนินการ: ติดตามสถานะ (Monitor Order)"}</p>
              <p>{"ให้ CS Monitor ออเดอร์ดังกล่าวของร้านที่ร้านมีการแจ้งมามาก "}{IHD_ADMIN_LINK}{" เพื่อที่ว่าหากเกิดปัญหาหรือคนขับยกเลิกกลางคันจะได้แก้ปัญหาได้ทันท่วงที"}</p>
            </div>
            <div className={"bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mt-4 text-sm"}>
              <strong>{"แจ้งร้านค้า:"}</strong> {"ตอนนี้เราทำอะไรไม่ได้ นอกจากการรอให้คนขับไปถึงปลายทางเนื่องจากเป็นสถานะ On the Way แต่เราจะช่วย monitor ไว้เผื่อว่าออเดอร์นี้เกิดปัญหาอะไรขึ้นจะรีบแจ้งทางร้าน"}
            </div>
          </React.Fragment>
        )
      }
    }
  },
  'cancel': {
    title: '3. คนขับยกเลิกออเดอร์',
    options: {
      'before_pickup': {
        title: '1. ยกเลิกก่อนจะมาที่ร้าน', options: {
          'redispatch': { 
            title: '1. เรียกคนขับคนใหม่มารับอีกครั้ง', isFinal: true, 
            content: (
              <React.Fragment>
                {['แจ้งร้านให้เรียกคนขับอีกครั้ง', 'ให้ร้านกดเข้าไปที่ออเดอร์นั้นๆ', 'กดจุด 3 จุดมุมบนขวา', 'กด Redispatch Order'].map((step, i) => {
                  return <StepBox key={i} index={i} step={step} />;
                })}
              </React.Fragment>
            )
          },
          'store_delivers': { 
            title: '2. ร้านสามารถนำออเดอร์ไปส่งเองได้', isFinal: true, 
            content: <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>{"แจ้งร้านอาหารให้ดำเนินการจัดส่งเอง"}</div> 
          },
        }
      },
      'after_pickup': {
        title: '2. ยกเลิกหลังจากเอาอาหารไปแล้ว', options: {
          'wants_food': {
            title: '1. ลูกค้าต้องการอาหารอยู่', options: {
              'store_delivers': { 
                title: '1. ร้านไปส่งเอง', isFinal: true, 
                content: (
                  <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>
                    <ol className={"list-decimal list-inside"}>
                      <li>{"ให้ร้านทำอาหารใหม่"}</li>
                      <li>{"ให้ร้านอาหารนำออเดอร์ดังกล่าวไปส่งให้กับลูกค้าเอง"}</li>
                      <li>{"ให้ร้านเข้าที่ "}<AppName name={"IHD App"} underline={false} /></li>
                      <li>{"เลือกออเดอร์เดิมและ Refund ค่าอาหารที่หายไปกับการส่งไม่สำเร็จ"}</li>
                      <li>{"กดจุด 3 จุดมุมบนขวา"}</li>
                      <li>{"เลือก "}<strong>{"Request Refund"}</strong></li>
                    </ol>
                    <p className={"mt-2 text-sm text-green-700 font-semibold"}>{"เพื่อขอเงินคืนกับค่าอาหารที่เสียไปกับออเดอร์ก่อนหน้า"}</p>
                  </div>
                )
              },
              'lfy_redispatch': { 
                title: '2. Local for you หา Driver ให้อีกครั้ง', isFinal: true, 
                content: (
                  <TwoAppBoxes 
                    box1Title={<React.Fragment><AppName name={"IHD App"} /> {"(เรียกคนขับใหม่)"}</React.Fragment>} 
                    box1Content={<ol className={"list-decimal list-inside"}><li>{"แจ้งร้านให้เรียกคนขับอีกครั้ง"}</li><li>{"ให้ร้านกดเข้าไปที่ออเดอร์นั้นๆ"}</li><li>{"กดจุด 3 จุดมุมบนขวา"}</li><li>{"กด "}<strong>{"Redispatch Order"}</strong></li></ol>} 
                    box2Title={<React.Fragment><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่ส่งไม่สำเร็จ/หายไป)"}</React.Fragment>} 
                    box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ให้ร้านเข้าที่ IHD App"}</li><li>{"เลือกออเดอร์เดิมที่ต้องการเงินคืนจากการส่งไม่สำเร็จ"}</li><li>{"กดจุด 3 จุดมุมขวาบน"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่ส่งไม่สำเร็จของออเดอร์ก่อนหน้า)"}</p></React.Fragment>} 
                  /> 
                )
              }
            }
          },
          'customer_cancels': { 
            title: '2. ลูกค้าต้องการยกเลิกออเดอร์', isFinal: true, 
            content: (
              <TwoAppBoxes 
                box1Title={<React.Fragment><AppName name={"Local for you App"} /> {"(Refund ลูกค้า)"}</React.Fragment>} 
                box1Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ Application restaurant order-taking app (Local for you)"}</li><li>{"เลือกออเดอร์นั้นๆที่ต้องการ Refund"}</li><li>{"กดจุดสามจุดมุมขวาล่าง"}</li><li>{"กด Cancel order"}</li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}</p></React.Fragment>} 
                box2Title={<React.Fragment><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่ส่งไม่สำเร็จ/หายไป)"}</React.Fragment>} 
                box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ IHD App"}</li><li>{"เลือกออเดอร์นั้นๆ"}</li><li>{"กดจุด 3 จุดมุมขวา"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}</p></React.Fragment>} 
              /> 
            )
          }
        }
      }
    }
  },
  'missing-food': {
    title: '4. อาหารไม่ครบ',
    options: {
      'refund': { 
        title: '1. ร้านต้องทำการ Refund เฉพาะ Items ที่ขาดให้ลูกค้า', isFinal: true, 
        content: (
          <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>
            {"แจ้งร้านค้าให้ดำเนินการ Refund เฉพาะรายการอาหารที่ขาดผ่านระบบ Stripe/Payment Gateway"}
            <ol className={"list-decimal list-inside mt-3"}>
              <li>{"เข้าสู่ระบบ Stripe/Payment Gateway"}</li>
              <li>{"ค้นหา Transaction ของออเดอร์ดังกล่าว"}</li>
              <li>{"ทำการ Refund แบบ Partial Refund สำหรับรายการที่ขาดหายไป"}</li>
            </ol>
          </div>
        )
      },
      'send_missing': {
        title: '2. ร้านส่งรายการอาหารที่ขาดให้ลูกค้า', options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>{"ให้ร้านอาหารเตรียมเมนูที่ขาดให้พร้อม และแจ้งร้านอาหารให้ดำเนินการจัดส่งเมนูที่ขาดไปให้ลูกค้าด้วยตนเอง"}</div> 
          },
          'lfy_redispatch': { 
            title: '2. Local for you เรียกคนขับให้ใหม่', isFinal: true, 
            content: (
              <React.Fragment>
                {[
                  'ให้ร้านอาหารเตรียมเมนูที่ขาดให้พร้อม',
                  'ขอข้อมูลที่อยู่จัดส่งที่ถูกต้องจากร้านค้าเพื่อสร้างออเดอร์จัดส่งใหม่สำหรับรายการที่ขาด',
                  'Manually Create Delivery order ผ่าน \uD83D\uDC49 IHD Admin Panel (ของร้านค้านั้นๆ)',
                  'กดเรียก Driver มารับอาหารที่ขาดเหลือที่ร้าน (ตรงนี้ทางร้านต้องจ่ายค่าจัดส่งเอง)'
                ].map((step, i) => {
                  return <StepBox key={i} index={i} step={step} />;
                })}
              </React.Fragment>
            )
          }
        }
      }
    }
  },
  'delivered-no-receive': {
    title: '5. สถานะ Delivered แต่ลูกค้าไม่ได้รับอาหาร',
    content: (
      <div className={"bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-4 text-sm"}>
        <p className={"font-bold"}>{"หมายเหตุ:"}</p>
        <p>{"*คนขับอยู่สถานะไหนโดยการสอบถามทางร้านหรือเข้าไปที่ "}{IHD_ADMIN_LINK}</p>
      </div>
    ),
    options: {
      'wants_food': {
        title: '1. ลูกค้าต้องการอาหารอยู่', options: {
          'store_delivers': { 
            title: '1. ร้านไปส่งเอง', isFinal: true, 
            content: (
              <div className={"bg-white border-green-500 p-4 rounded-md border-l-4"}>
                <ol className={"list-decimal list-inside"}>
                  <li>{"ให้ร้านทำอาหารใหม่"}</li>
                  <li>{"ให้ร้านอาหารนำออเดอร์ดังกล่าวไปส่งให้กับลูกค้าเอง"}</li>
                  <li>{"ให้ร้านเข้าที่ "}<AppName name={"IHD App"} underline={false} /></li>
                  <li>{"เลือกออเดอร์นั้นๆ"}</li>
                  <li>{"กดจุด 3 จุดมุมขวาบน"}</li>
                  <li>{"เลือก "}<strong>{"Request Refund"}</strong></li>
                </ol>
                <p className={"mt-2 text-sm text-green-700 font-semibold"}>{"เพื่อขอเงินคืนกับค่าอาหารที่หายไปกับออเดอร์ก่อนหน้า"}</p>
              </div>
            )
          },
          'lfy_redispatch': { 
            title: '2. Local for you หา Driver ให้อีกครั้ง', isFinal: true, 
            content: (
              <TwoAppBoxes 
                box1Title={<React.Fragment><AppName name={"IHD App"} /> {"(เรียกคนขับใหม่)"}</React.Fragment>} 
                box1Content={<ol className={"list-decimal list-inside"}><li>{"แจ้งร้านให้เรียกคนขับอีกครั้ง"}</li><li>{"ให้ร้านกดเข้าไปที่ออเดอร์เดิมที่เกิดปัญหา ใน "}<AppName name={"IHD App"} underline={false} /></li><li>{"กดจุด 3 จุดบนขวา"}</li><li>{"กด "}<strong>{"Redispatch Order"}</strong></li></ol>} 
                box2Title={<React.Fragment><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่หายไป)"}</React.Fragment>} 
                box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"เลือกออเดอร์เดิมที่ต้องการเงินคืน"}</li><li>{"กดจุด 3 จุดมุมขวาบน"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}</p></React.Fragment>} 
              /> 
            )
          }
        }
      },
      'customer_cancels': {
        title: '2. ลูกค้าต้องการยกเลิกออเดอร์', isFinal: true, 
        content: (
          <TwoAppBoxes
            box1Title={<React.Fragment><AppName name={"Local for you App"} /> {"(Refund ลูกค้า)"}</React.Fragment>}
            box1Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ Application restaurant order-taking app (Local for you)"}</li><li>{"เลือกออเดอร์นั้นๆที่ต้องการ Refund"}</li><li>{"กดจุดสามจุดมุมขวาล่าง"}</li><li>{"กด Cancel order"}</li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}</p></React.Fragment>}
            box2Title={<React.Fragment><AppName name={"IHD App"} /> {"(ขอ Refund ค่าอาหารที่ส่งไม่สำเร็จ/หายไป)"}</React.Fragment>}
            box2Content={<React.Fragment><ol className={"list-decimal list-inside"}><li>{"ไปที่ IHD App"}</li><li>{"เลือกออเดอร์นั้นๆ"}</li><li>{"กดจุด 3 จุดมุมขวา"}</li><li>{"เลือก "}<strong>{"Request Refund"}</strong></li></ol><p className={"mt-2 text-sm text-green-700 font-semibold"}>{"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}</p></React.Fragment>} 
          />
        )
      },
      'wait_monitor': { 
        title: '3. รอต่อไป', isFinal: true, 
        content: (
          <React.Fragment>
            <div className={"bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mb-4 text-sm"}>
              <p className={"font-bold text-blue-700"}>{"ดำเนินการ: ติดตามสถานะ (Monitor Order)"}</p>
              <p>{"ให้ CS Monitor ออเดอร์ดังกล่าวของร้านที่ร้านมีการแจ้งมามาก "}{IHD_ADMIN_LINK}{" เพื่อที่ว่าหากเกิดปัญหาหรือคนขับยกเลิกกลางคันจะได้แก้ปัญหาได้ทันท่วงที"}</p>
            </div>
            <div className={"bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mt-4 text-sm"}>
              <strong>{"แจ้งร้านค้า:"}</strong> {"ตอนนี้เราทำอะไรไม่ได้ นอกจากการรอให้คนขับไปถึงปลายทางเนื่องจากเป็นสถานะ On the Way แต่เราจะช่วย monitor ไว้เผื่อว่าออเดอร์นี้เกิดปัญหาอะไรขึ้นจะรีบแจ้งทางร้าน"}
            </div>
          </React.Fragment>
        )
      }
    }
  },
  'manual-call': {
    title: <div className={"flex flex-col"}><span>{"Manually Call a New Driver"}</span><span className={"text-xs font-normal opacity-80"}>{"(สำหรับร้านที่ให้ไปส่งอาหารที่ขาด)"}</span></div>,
    isFinal: true,
    content: (
      <div className={"bg-white border-pink-500 p-4 rounded-md border-l-4"}>
        <h4 className={"font-bold text-pink-700 mb-2"}>{"ขั้นตอนการเรียกคนขับแบบ Manual:"}</h4>
        <ol className={"list-decimal list-inside space-y-2"}>
          <li>{"สอบถามเลข Order เดิม จากทางร้าน (เพื่อหาข้อมูล)"}</li>
          <li>{"ไปที่ "}{IHD_ADMIN_LINK}</li>
          <li>{"เลือกเมนู "}<strong>{"\"Create Order\""}</strong></li>
          <li>{"เลือกวันและเวลาปัจจุบัน ของร้าน"}</li>
          <li>{"กรอกข้อมูลลูกค้า (ชื่อ/เบอร์โทร/ที่อยู่) ที่นำมาจาก SC"}</li>
          <li>{"ใส่หมายเลขออเดอร์ (#1234 ง่ายๆ)"}</li>
          <li>{"ใส่จำนวน- กี่ชิ้น - ที่ร้านต้องการจัดส่ง ราคาเป็น $0"}</li>
          <li>{"กด "}<strong>{"\"Next\""}</strong>{" เพื่อเลือก Driver (เจ้าที่ร้านใช้ส่งประจำ)"}</li>
          <li>{"กด "}<strong>{"\"Create Order\""}</strong>{" เพื่อยืนยัน"}</li>
        </ol>
        <div className={"mt-4 p-3 bg-pink-50 rounded-lg border border-pink-100 text-xs text-pink-800"}>
          <p><strong>{"หมายเหตุ:"}</strong> {"วิธีนี้ใช้สำหรับกรณีฉุกเฉินหรือการส่งรายการอาหารที่ตกหล่นซึ่งร้านค้ายอมรับค่าจัดส่งเพิ่มเติม"}</p>
        </div>
      </div>
    )
  }
};
