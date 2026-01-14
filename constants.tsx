
import React from 'react';

export const IHD_ADMIN_LINK = (
  <a 
    href={"https://app.inhousedelivery.com/#/live-view"} 
    target={"_blank"} 
    rel={"noopener noreferrer"} 
    className={"bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center text-sm font-bold hover:bg-green-700 transition-all shadow-md active:scale-95 whitespace-nowrap"}
  >
    {"👉 IHD Admin Panel"}
  </a>
);

// Define props interface for StepBox component
interface StepBoxProps {
  index: number;
  step: React.ReactNode;
  key?: React.Key;
}

// Helper component for rendering ordered steps in the delivery flow
function StepBox({ index, step }: StepBoxProps) {
  return (
    <div className={"flex items-start p-4 bg-white rounded-xl border border-indigo-100 shadow-sm mb-3 transition-all hover:shadow-md"}>
      <div className={"flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4"}>
        {index + 1}
      </div>
      <div className={"text-gray-800 leading-relaxed pt-1 font-medium text-sm"}>{step}</div>
    </div>
  );
}

export const deliveryFlow: any = {
  'late': {
    title: '1. คนขับมาช้า / รออาหารนาน',
    content: (
      <div className={"bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4 shadow-sm"}>
        <p className={"text-sm font-bold text-blue-800"}>{"🔍 ขั้นตอนการเช็ค:"}</p>
        <p className={"text-xs text-blue-900 mt-1"}>{"เช็คใน "}{IHD_ADMIN_LINK}{" ว่าคนขับอยู่ตรงไหน ถ้าไม่ขยับเลยเกิน 5-10 นาที ให้เลือกหัวข้อด้านล่าง"}</p>
      </div>
    ),
    options: {
      'redispatch_needed': {
        title: '1. หาคนขับใหม่ (Redispatch)',
        options: {
          'store_wait': {
            title: 'เรียกคนขับ IHD', isFinal: true,
            content: (
              <React.Fragment>
                {['เข้าไปที่ออเดอร์ใน IHD App ของร้าน', 'กดปุ่มสามจุด (...) ขวาบน', 'เลือก "Redispatch Order" เพื่อเปลี่ยนคนขับทันที'].map((step, i) => (
                  <StepBox key={i} index={i} step={step} />
                ))}
              </React.Fragment>
            )
          },
          'store_delivers': {
            title: 'ร้านขอไปส่งเอง', isFinal: true,
            content: (
              <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
                <div className={"bg-white rounded-2xl p-2"}>
                  {[
                    "ไปที่ IHD App",
                    "เลือกออเดอร์นั้นๆ",
                    "กดจุด 3 จุดมุมขวา",
                    "Cancel Driver"
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-[13px] text-red-600 font-bold px-4 py-2"}>
                    {"Note: จะยกเลิกได้ต่อเมื่อสถานะคนขับเป็น a waiting driver หรือ picking up ในระยะแรกๆ"}
                  </p>
                </div>

                <div className={"p-5 bg-white border border-green-100 rounded-2xl shadow-sm"}>
                  <p className={"font-bold text-green-700 text-sm flex items-center mb-3"}>
                    <span className={"mr-2"}>{"💡"}</span> {"หากไม่สามารถ Cancel Driver ได้ (Driver กำลังมา):"}
                  </p>
                  <div className={"space-y-3 pl-7"}>
                    <p className={"text-sm text-gray-700"}><span className={"font-bold"}>{"1. (ตัวเลือก 1)"}</span> {"ร้านเจรจากับลูกค้าให้รอรับอาหาร"}</p>
                    <p className={"text-sm text-gray-700"}><span className={"font-bold"}>{"2. (ตัวเลือก 2)"}</span> {"ปล่อยคนขับมาถึงร้าน \u2192 แจ้งยกเลิก \u2192 ร้านขอ Refund ค่าส่งจาก CS"}</p>
                  </div>
                </div>

                <div className={"p-5 bg-slate-100 border-l-4 border-slate-400 rounded-r-2xl shadow-sm"}>
                  <p className={"font-bold text-slate-800 text-[13px] mb-2"}>
                    {"รายละเอียดเพิ่มเติมสำหรับตัวเลือกที่ 2 (กรณีไม่สามารถยกเลิก Driver ได้):"}
                  </p>
                  <p className={"text-[12px] text-slate-700 leading-relaxed"}>
                    {"ทางร้านควรปล่อยให้ Driver มาที่ร้านตามปกติ จากนั้นแจ้ง Driver ว่าออเดอร์ถูกยกเลิกไปแล้ว และทำเรื่องขอ Refund ค่าคนขับมาทาง CS ด้วยเหตุผล: \"รอคนขับมารับอาหารที่ร้านนาน ลูกค้ายกเลิกออเดอร์แล้ว ขอ Refund ค่าส่งที่เรียกคนขับมาและคนขับมาข้า\""}
                  </p>
                </div>
              </div>
            )
          }
        }
      },
      'cancel_order': {
        title: '2. ต้องการยกเลิกคนขับ',
        options: {
          'store_send_self': {
            title: '1. ร้านไปส่งเอง', isFinal: true,
            content: (
              <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
                <div className={"bg-white rounded-2xl p-2"}>
                  {[
                    "ไปที่ IHD App",
                    "เลือกออเดอร์นั้นๆ",
                    "กดจุด 3 จุดมุมขวา",
                    "Cancel Driver"
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-[13px] text-red-600 font-bold px-4 py-2"}>
                    {"Note: จะยกเลิกได้ต่อเมื่อสถานะคนขับเป็น a waiting driver หรือ picking up ในระยะแรกๆ"}
                  </p>
                </div>

                <div className={"p-5 bg-white border border-green-100 rounded-2xl shadow-sm"}>
                  <p className={"font-bold text-green-700 text-sm flex items-center mb-3"}>
                    <span className={"mr-2"}>{"💡"}</span> {"หากไม่สามารถ Cancel Driver ได้ (Driver กำลังมา):"}
                  </p>
                  <div className={"space-y-3 pl-7"}>
                    <p className={"text-sm text-gray-700"}><span className={"font-bold"}>{"1. (ตัวเลือก 1)"}</span> {"ร้านเจรกับลูกค้าให้รอรับอาหาร"}</p>
                    <p className={"text-sm text-gray-700"}><span className={"font-bold"}>{"2. (ตัวเลือก 2)"}</span> {"ปล่อยคนขับมาถึงร้าน \u2192 แจ้งยกเลิก \u2192 ร้านขอ Refund ค่าส่งจาก CS"}</p>
                  </div>
                </div>

                <div className={"p-5 bg-slate-100 border-l-4 border-slate-400 rounded-r-2xl shadow-sm"}>
                  <p className={"font-bold text-slate-800 text-[13px] mb-2"}>
                    {"รายละเอียดเพิ่มเติมสำหรับตัวเลือกที่ 2 (กรณีไม่สามารถยกเลิก Driver ได้):"}
                  </p>
                  <p className={"text-[12px] text-slate-700 leading-relaxed"}>
                    {"ทางร้านควรปล่อยให้ Driver มาที่ร้านตามปกติ จากนั้นแจ้ง Driver ว่าออเดอร์ถูกยกเลิกไปแล้ว และทำเรื่องขอ Refund ค่าคนขับมาทาง CS ด้วยเหตุผล: \"รอคนขับมารับอาหารที่ร้านนาน ลูกค้ายกเลิกออเดอร์แล้ว ขอ Refund ค่าส่งที่เรียกคนขับมาและคนขับมาข้า\""}
                  </p>
                </div>
              </div>
            )
          },
          'full_refund_customer': {
            title: '2. ลูกค้าไม่ต้องการ Order แล้วต้องการ Refund', isFinal: true,
            content: (
              <div className={"space-y-6 animate-in fade-in duration-500"}>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6"}>
                  {/* IHD App Section */}
                  <div className={"bg-blue-50/50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                    <h4 className={"text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2"}>{"IHD App"}</h4>
                    <div className={"space-y-3 mb-4"}>
                      {[
                        "ไปที่ Application",
                        "เลือกออเดอร์นั้นๆ",
                        "กดจุด 3 จุดมุมขวา",
                        "Cancel Driver"
                      ].map((step, i) => (
                        <div key={i} className={"flex items-start text-[16px] text-gray-800 font-semibold"}>
                          <span className={"mr-3 font-bold text-gray-700"}>{i + 1 + "."}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className={"text-[13px] text-red-600 font-bold mb-6"}>
                      {"Note: จะยกเลิกได้ต่อเมื่อสถานะคนขับเป็น a waiting driver หรือ picking up ในระยะแรกๆ"}
                    </p>
                    
                    <div className={"mt-auto pt-4 border-t border-blue-100"}>
                      <p className={"font-bold text-green-700 text-[14px] flex items-center mb-3"}>
                        <span className={"mr-2"}>{"💡"}</span> {"หากไม่สามารถ Cancel Driver ได้ (Driver กำลังมา):"}
                      </p>
                      <div className={"space-y-2"}>
                        <p className={"text-sm text-gray-700"}><span className={"font-bold"}>{"(ตัวเลือก 1)"}</span> {"ร้านเจจรากกับลูกค้าให้รอรับอาหาร"}</p>
                        <p className={"text-sm text-gray-700"}><span className={"font-bold"}>{"(ตัวเลือก 2)"}</span> {"ปล่อยคนขับมาถึงร้าน \u2192 แจ้งยกเลิก \u2192 ร้านขอ Refund ค่าส่งจาก CS"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Local for you Section */}
                  <div className={"bg-red-50/50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                    <h4 className={"text-xl font-bold text-red-800 mb-4 border-b border-red-200 pb-2"}>{"Local for you App"}</h4>
                    <div className={"space-y-3 mb-6"}>
                      {[
                        "ไปที่ Application restaurant order-taking app (Local for you)",
                        "เลือกออเดอร์นั้นๆที่ต้องการ Refund",
                        "กดจุดสามจุดมุมขวาล่าง",
                        "กด Cancel order"
                      ].map((step, i) => (
                        <div key={i} className={"flex items-start text-[16px] text-gray-800 font-semibold"}>
                          <span className={"mr-3 font-bold text-red-800"}>{i + 1 + "."}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <p className={"text-[14px] text-green-600 font-bold mt-auto"}>
                      {"(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}
                    </p>
                  </div>
                </div>

                {/* Main Footer Detail (Large gray box) */}
                <div className={"p-6 bg-slate-50 border-l-8 border-slate-300 rounded-r-2xl shadow-inner border border-slate-200"}>
                  <p className={"font-bold text-slate-800 text-[15px] mb-3 uppercase tracking-wide"}>
                    {"รายละเอียดเพิ่มเติมสำหรับตัวเลือกที่ 2 (กรณีไม่สามารถยกเลิก Driver ได้):"}
                  </p>
                  <p className={"text-[14px] text-slate-700 leading-relaxed font-medium"}>
                    {"ทางร้านควรปล่อยให้ Driver มาที่ร้านตามปกติ จากนั้นแจ้ง Driver ว่าออเดอร์ถูกยกเลิกไปแล้ว และทำเรื่องขอ Refund ค่าคนขับมาทาง CS ด้วยเหตุผล: \"รอคนขับมารับอาหารที่ร้านนาน ลูกค้ายกเลิกออเดอร์แล้ว ขอ Refund ค่าส่งที่เรียกคนขับมาและคนขับมาข้า\""}
                  </p>
                </div>
              </div>
            )
          }
        }
      },
      'divider_action': { title: 'Action need', isDivider: true },
      'wrong_phone': {
        title: 'เบอร์ลูกค้าผิด / ไม่ครบ', isFinal: true,
        content: (
          <div className={"space-y-3"}>
            <StepBox index={0} step={"หากเบอร์ผิด ให้โทรสอบถามร้านเพื่อขอเบอร์ที่ถูกต้อง"} />
            <StepBox index={1} step={"หากติดต่อลูกค้าไม่ได้ ให้ใส่ \"เบอร์ร้าน\" แทน"} />
            <StepBox index={2} step={"กด Next ในการเรียกคนขับมาใหม่อีกครั้ง"} />
          </div>
        )
      },
      'no_driver_assign': {
        title: 'ระบบไม่ Assign Driver',
        options: {
          'store_send_self': {
            title: '1 ร้านไปส่งเอง', isFinal: true,
            content: (
              <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
                <div className={"bg-white rounded-2xl p-2"}>
                  {[
                    "ไปที่ IHD App",
                    "เลือกออเดอร์นั้นๆ",
                    "กดจุด 3 จุดมุมขวา",
                    "Cancel Driver"
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-[13px] text-red-600 font-bold px-4 py-2"}>
                    {"Note: จะยกเลิกได้ต่อเมื่อสถานะคนขับเป็น a waiting driver หรือ picking up ในระยะแรกๆ"}
                  </p>
                </div>
                <div className={"p-5 bg-white border border-green-100 rounded-2xl shadow-sm"}>
                  <p className={"font-bold text-green-700 text-sm flex items-center mb-3"}>
                    <span className={"mr-2"}>{"💡"}</span> {"หากไม่สามารถ Cancel Driver ได้ (Driver กำลังมา):"}
                  </p>
                  <p className={"text-sm text-gray-700 pl-7"}>{"ปล่อยคนขับมาถึงร้าน \u2192 แจ้งยกเลิก \u2192 ร้านขอ Refund ค่าส่งจาก CS"}</p>
                </div>
              </div>
            )
          },
          'reassign_order': {
            title: '2. reassign order', isFinal: true,
            content: (
              <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
                <div className={"bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4"}>
                  <p className={"text-sm font-bold text-blue-800"}>{"💡 คำแนะนำพิเศษ:"}</p>
                  <p className={"text-xs text-blue-700 mt-1"}>{"หากหาคนขับจาก doordash ให้ reassign ไปที่ uber"}</p>
                </div>
                <StepBox index={0} step={"เลือกออเดอร์ที่ต้องการใน IHD App"} />
                <StepBox index={1} step={"กดจุด 3 จุดมุมขวาบน"} />
                <StepBox index={2} step={"เลือก reassign order และเลือกแบรนด์คนขับใหม่ (เช่น Uber)"} />
              </div>
            )
          }
        }
      },
      'need_payment_update': {
        title: 'Need Payment Update',
        options: {
          'send_link': {
            title: 'ส่ง link ให้ร้านทำเอง', isFinal: true,
            content: (
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                {/* กล่องซ้าย: สิ่งที่ร้านต้องทำ - โทนสี Amber */}
                <div className={"bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm"}>
                  <h4 className={"font-bold text-amber-800 mb-4 flex items-center"}>
                    <span className={"mr-2"}>🏪</span> {"สิ่งที่ร้านต้องทำ"}
                  </h4>
                  <StepBox index={0} step={
                    <span>
                      {"ส่งลิ้งค์นี้ "}
                      <a href={"https://app.inhousedelivery.com/#/billing"} target={"_blank"} className={"text-amber-600 underline font-bold"}>{"billing link"}</a>
                      {" ให้ร้านเข้า access"}
                    </span>
                  } />
                  <StepBox index={1} step={"กด Edit Billing ตรงมุมขวาเพื่ออัพเดทบัตร"} />
                  <StepBox index={2} step={"กดที่ setting มุมบนขวา"} />
                  <StepBox index={3} step={"จากนั้นไปที่ Dispatch และไห้เปิด Auto - redispatch"} />
                </div>

                {/* กล่องขวา: สิ่งที่ Staff ต้องทำ - โทนสี Indigo */}
                <div className={"bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-sm"}>
                  <h4 className={"font-bold text-indigo-800 mb-4 flex items-center"}>
                    <span className={"mr-2"}>🎧</span> {"Step ที่ Local for you staff ต้องทำ"}
                  </h4>
                  <StepBox index={0} step={
                    <span>
                      {"บอก IHD Team ในนี้ "}
                      <a href={"https://app.slack.com/client/T04NWRSKF1B/C04PPEZL4TS"} target={"_blank"} className={"text-indigo-600 underline font-bold"}>{"Slack Channel"}</a>
                    </span>
                  } />
                  <StepBox index={1} step={"บอกว่า: ร้าน.....อัพเดทบัตรมาแล้ว โปรดชาร์จและเปิด Auto - redispatch"} />
                </div>
              </div>
            )
          },
          'request_card': {
            title: 'ขอเลขบัตรร้านมาไห้เราทำไห้', isFinal: true,
            content: (
              <div className={"bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-sm animate-in slide-in-from-bottom-2 duration-500"}>
                <h4 className={"font-bold text-indigo-800 mb-4 flex items-center"}>
                  <span className={"mr-2"}>🛠️</span> {"Step ที่ต้องทำคือ"}
                </h4>
                {[
                  <span>{"1. เข้า "}{IHD_ADMIN_LINK}</span>,
                  "2. ค้นหาร้านที่ต้องการ (มุมบนขวา)",
                  "3. เลือก Setting",
                  "4. เลือก Dispatch มุมซ้าย (อันที่ 2)",
                  "5. กด update billing ที่ตรง Auto-dispatch",
                  "6. เปิด Auto-redispatch",
                  <span>
                    {"7. แจ้ง IHD team ว่า Payment updated #ihd-delivery-support ใน "}
                    <a href={"https://app.slack.com/client/T04NWRSKF1B/C04PPEZL4TS"} target={"_blank"} className={"text-indigo-600 underline font-bold"}>{"Slack"}</a>
                  </span>
                ].map((step, i) => (
                  <StepBox key={i} index={i} step={step} />
                ))}
              </div>
            )
          }
        }
      },
      'driver_cancelled': {
        title: 'คนขับกดยกเลิก',
        options: {
          'redispatch_again': {
            title: '1. เรียกคนขับคนใหม่มารับอีกครั้ง',
            isFinal: true,
            content: (
              <div className={"space-y-3 animate-in slide-in-from-bottom-2 duration-500"}>
                <StepBox index={0} step={"ตรวจสอบเหตุผลที่คนขับยกเลิกใน IHD Admin (เช่น ติดต่อลูกค้าไม่ได้, รถเสีย)"} />
                <StepBox index={1} step={"กดปุ่ม 'Redispatch Order' ทันทีเพื่อหาคนขับคนใหม่"} />
                <StepBox index={2} step={"แจ้งทางร้านให้เตรียมอาหารรอ และแจ้งลูกค้าหากมีการส่งที่ล่าช้า"} />
              </div>
            )
          },
          'store_delivers_direct': {
            title: '2. ร้านสามารถนำออเดอร์ไปส่งเองได้',
            isFinal: true,
            content: (
              <div className={"space-y-3 animate-in slide-in-from-bottom-2 duration-500"}>
                <StepBox index={0} step={"ยกเลิกคนขับเดิมในระบบ IHD (ถ้ายังมีคนขับค้างอยู่)"} />
                <StepBox index={1} step={"ร้านดำเนินการจัดส่งอาหารให้ลูกค้าโดยตรง"} />
                <StepBox index={2} step={"แจ้งลูกค้าถึงเวลาจัดส่งที่แน่นอนโดยทางร้าน"} />
              </div>
            )
          }
        }
      }
    }
  },
  'not-received': {
    title: '2. คนขับนำอาหารไปแล้วแต่ลูกค้าไม่ได้รับ',
    options: {
      'customer_wants_food': {
        title: '1. ลูกค้าต้องการอาหารอยู่',
        options: {
          'store_send_direct': {
            title: '1. ร้านไปส่งเอง', isFinal: true,
            content: (
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                <div className={"bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm"}>
                  <h4 className={"font-bold text-amber-700 mb-4"}>{"ร้านอาหาร (ส่งใหม่)"}</h4>
                  {["ร้านทำอาหารใหม่", "นำออเดอร์ไปส่งลูกค้าเอง"].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                </div>
                <div className={"bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm"}>
                  <h4 className={"font-bold text-indigo-700 mb-4"}>{"IHD App"}</h4>
                  {[
                    "ให้ร้านเข้าที่ Inhouse Delivery Application",
                    "เลือกออเดอร์นั้นๆ",
                    "กดจุด 3 จุดมุมขวาบน",
                    "เลือก Request Refund"
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-sm font-bold text-green-600 mt-4"}>
                    {"(เพื่อขอเงินคืนกับค่าอาหารที่หายไปกับออเดอร์ก่อนหน้า)"}
                  </p>
                </div>
              </div>
            )
          },
          'call_new_driver_manual': {
            title: '2. เรียกคนขับใหม่ (Manual Order)', isFinal: true,
            content: (
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                {/* กล่องซ้าย - เรียกคนขับใหม่ */}
                <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                  <h4 className={"text-lg font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2 inline-block self-start"}>
                    {"IHD App (เรียกคนขับใหม่)"}
                  </h4>
                  <div className={"space-y-3 mt-2"}>
                    {[
                      "แจ้งร้านให้เรียกคนขับอีกครั้ง",
                      "ให้ร้านกดเข้าไปที่ออเดอร์เดิมที่เกิดปัญหา ใน IHD App",
                      "กดจุด 3 จุดบนมุมขวา",
                      <span>{"กด "}<strong>{"Redispatch Order"}</strong></span>
                    ].map((step, i) => (
                      <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                        <span className={"mr-2"}>{i + 1 + "."}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* กล่องขวา - ขอ Refund */}
                <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                  <h4 className={"text-lg font-bold text-red-700 mb-4 border-b-2 border-red-400 pb-2 inline-block self-start"}>
                    {"IHD App (ขอ Refund ค่าอาหารที่หายไป)"}
                  </h4>
                  <div className={"space-y-3 mt-2"}>
                    {[
                      "เลือกออเดอร์เดิมที่ต้องการเงินคืน",
                      "กดจุด 3 จุดมุมขวาบน",
                      <span>{"เลือก "}<strong>{"Request Refund"}</strong></span>
                    ].map((step, i) => (
                      <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                        <span className={"mr-2"}>{i + 1 + "."}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <p className={"text-sm font-bold text-green-600 mt-6"}>
                    {"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}
                  </p>
                </div>
              </div>
            )
          }
        }
      },
      'customer_wants_cancel': {
        title: '2. ลูกค้าต้องการยกเลิกออเดอร์', isFinal: true,
        content: (
          <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500"}>
            {/* LFY App Section */}
            <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
              <h4 className={"text-xl font-bold text-red-800 mb-4 border-b border-red-200 pb-2"}>{"Full Refund (LFY)"}</h4>
              <p className={"text-sm text-red-700 mb-4"}>{"คืนเงินค่าอาหารและค่าส่งให้ลูกค้า"}</p>
              {[
                "ไปที่ LFY Order-taking App",
                "เลือกออเดอร์ที่ต้องการยกเลิก",
                "กดจุด 3 จุด และเลือก Cancel Order",
                "เลือกเหตุผลที่เหมาะสมเพื่อให้ลูกค้าได้เงินคืน"
              ].map((step, i) => (
                <StepBox key={i} index={i} step={step} />
              ))}
              <p className={"text-[14px] text-green-600 font-bold mt-auto pt-4"}>
                {"*(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}
              </p>
            </div>

            {/* IHD Section */}
            <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
              <h4 className={"text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2"}>{"IHD (Refund)"}</h4>
              <p className={"text-sm text-blue-700 mb-4"}>{"ดึงเงินค่าคนขับคืนจาก IHD"}</p>
              {[
                "เข้า Application Inhouse Delivery",
                "ค้นหาออเดอร์เจ้าปัญหา",
                "กด Request Refund",
                "ระบุเหตุผล: Driver took food but customer didn't receive."
              ].map((step, i) => (
                <StepBox key={i} index={i} step={step} />
              ))}
              <p className={"text-[14px] text-green-600 font-bold mt-auto pt-4"}>
                {"*(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}
              </p>
            </div>
          </div>
        )
      },
      'customer_waits': {
        title: '3. รอต่อไป', isFinal: true,
        content: (
          <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
            {/* กล่อง 1: Monitor Status */}
            <div className={"bg-blue-50 border border-blue-200 border-l-4 border-l-blue-600 p-6 rounded-r-2xl shadow-sm"}>
              <p className={"text-[15px] leading-relaxed"}>
                <span className={"font-bold text-blue-800"}>{"ดำเนินการ: ติดตามสถานะ (Monitor Order)"}</span><br/>
                <span className={"text-gray-800"}>{"ให้ CS Monitor ออเดอร์ดังกล่าวของร้านที่ร้านมีการแจ้งมามาก "}{IHD_ADMIN_LINK}{" เพื่อที่ว่าหากเกิดปัญหาหรือคนขับยกเลิกกลางคันจะได้แก้ปัญหาได้ทันท่วงที"}</span>
              </p>
            </div>
            
            {/* กล่อง 2: Inform Store */}
            <div className={"bg-red-50 border border-red-200 border-l-4 border-l-red-600 p-6 rounded-r-2xl shadow-sm"}>
              <p className={"text-[15px] leading-relaxed text-gray-800"}>
                <span className={"font-bold text-red-800"}>{"แจ้งร้านค้า:"}</span> {"ตอนนี้เราทำอะไรไม่ได้ นอกจากการรอให้คนขับไปถึงปลายทางเนื่องจากเป็นสถานะ On the Way แต่เราจะช่วย monitor ไว้เผื่อว่าออเดอร์นี้เกิดปัญหาอะไรขึ้นจะรีบแจ้งทางร้าน"}
              </p>
            </div>
          </div>
        )
      }
    }
  },
  'driver-canceled-top': {
    title: '3. คนขับยกเลิกออเดอร์',
    options: {
      'before_store': {
        title: '1. ยกเลิกก่อนจะมาที่ร้าน',
        options: {
          'redispatch_again': {
            title: '1. เรียกคนขับคนใหม่มารับอีกครั้ง',
            isFinal: true,
            content: (
              <div className={"space-y-3 animate-in slide-in-from-bottom-2 duration-500"}>
                <StepBox index={0} step={"เข้าไปที่ออเดอร์ใน IHD App ของร้าน"} />
                <StepBox index={1} step={"กดปุ่มสามจุด (...) ขวาบน"} />
                <StepBox index={2} step={<span>{"เลือก "}<strong>{"Redispatch Order"}</strong>{" เพื่อเปลี่ยนคนขับทันที"}</span>} />
              </div>
            )
          },
          'store_delivers_direct': {
            title: '2. ร้านสามารถนำออเดอร์ไปส่งเองได้',
            isFinal: true,
            content: (
              <div className={"space-y-3 animate-in slide-in-from-bottom-2 duration-500"}>
                <StepBox index={0} step={"เข้าไปที่ออเดอร์ใน IHD App ของร้าน"} />
                <StepBox index={1} step={"กดปุ่มสามจุด (...) ขวาบน"} />
                <StepBox index={2} step={"กด Cancel Driver (หากมีคนขับใหม่ Assign มาแล้ว)"} />
                <StepBox index={3} step={"ร้านดำเนินการจัดส่งอาหารให้ลูกค้าโดยตรง"} />
              </div>
            )
          }
        }
      },
      'after_pickup': {
        title: '2. ยกเลิกหลังจากเอาอาหารไปแล้ว',
        options: {
          'customer_wants_food': {
            title: '1. ลูกค้าต้องการอาหารอยู่',
            options: {
              'store_delivers_self': {
                title: '1. ร้านไปส่งเอง',
                isFinal: true,
                content: (
                  <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                    {/* Operations box */}
                    <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                      <h4 className={"text-lg font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2 inline-block self-start"}>
                        {"การจัดการออเดอร์ (ชุดใหม่)"}
                      </h4>
                      <div className={"space-y-3 mt-2"}>
                        {[
                          "แจ้งร้านให้ทำอาหารใหม่ทันที",
                          "ร้านดำเนินการจัดส่งออเดอร์ให้ลูกค้าด้วยตัวเอง",
                          "แจ้งขออภัยลูกค้าและยืนยันเวลาจัดส่งชุดใหม่โดยทางร้าน"
                        ].map((step, i) => (
                          <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                            <span className={"mr-2"}>{i + 1 + "."}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Refund box */}
                    <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                      <h4 className={"text-lg font-bold text-red-700 mb-4 border-b-2 border-red-400 pb-2 inline-block self-start"}>
                        {"การขอ Refund (IHD)"}
                      </h4>
                      <div className={"space-y-3 mt-2"}>
                        {[
                          "ไปที่ Application Inhouse Delivery",
                          "ค้นหาออเดอร์เดิมที่เกิดปัญหา",
                          "กด Request Refund",
                          "ระบุเหตุผล: Driver took food but disappeared/cancelled."
                        ].map((step, i) => (
                          <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                            <span className={"mr-2"}>{i + 1 + "."}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <p className={"text-sm font-bold text-green-600 mt-auto pt-4"}>
                        {"(วิธีนี้ร้านจะได้เงินคืนทั้งค่าอาหารและค่าส่งเดิม)"}
                      </p>
                    </div>
                  </div>
                )
              },
              'lfy_reassign_driver': {
                title: '2. Local for you หา Driver ให้อีกครั้ง',
                isFinal: true,
                content: (
                  <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                    {/* Operations box */}
                    <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                      <h4 className={"text-lg font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2 inline-block self-start"}>
                        {"การจัดการออเดอร์ (ชุดใหม่)"}
                      </h4>
                      <div className={"space-y-3 mt-2"}>
                        {[
                          "แจ้งร้านให้ทำอาหารใหม่ทันที",
                          "ไปที่ Application Inhouse Delivery ค้นหาออเดอร์เดิม",
                          "กดจุด 3 จุดมุมบนขวา และเลือก Redispatch Order",
                          "แจ้งขออภัยลูกค้าและยืนยันการจัดส่งชุดใหม่"
                        ].map((step, i) => (
                          <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                            <span className={"mr-2"}>{i + 1 + "."}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Refund box */}
                    <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                      <h4 className={"text-lg font-bold text-red-700 mb-4 border-b-2 border-red-400 pb-2 inline-block self-start"}>
                        {"การขอ Refund (IHD)"}
                      </h4>
                      <div className={"space-y-3 mt-2"}>
                        {[
                          "ไปที่ Application Inhouse Delivery",
                          "ค้นหาออเดอร์เดิม (รายการที่คนขับคนแรกกดยกเลิก)",
                          "กด Request Refund",
                          "ระบุเหตุผล: Driver took food but disappeared/cancelled."
                        ].map((step, i) => (
                          <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                            <span className={"mr-2"}>{i + 1 + "."}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <p className={"text-sm font-bold text-green-600 mt-auto pt-4"}>
                        {"(วิธีนี้ร้านจะได้เงินคืนทั้งค่าอาหารและค่าส่งเดิม)"}
                      </p>
                    </div>
                  </div>
                )
              }
            }
          },
          'customer_wants_cancel': {
            title: '2. ลูกค้าต้องการยกเลิกออเดอร์',
            isFinal: true,
            content: (
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500"}>
                {/* LFY App Section */}
                <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                  <h4 className={"text-xl font-bold text-red-800 mb-4 border-b border-red-200 pb-2"}>{"Full Refund (LFY)"}</h4>
                  <p className={"text-sm text-red-700 mb-4"}>{"คืนเงินค่าอาหารและค่าส่งให้ลูกค้า"}</p>
                  {[
                    "ไปที่ LFY Order-taking App",
                    "เลือกออเดอร์ที่ต้องการยกเลิก",
                    "กดจุด 3 จุด และเลือก Cancel Order",
                    "เลือกเหตุผลที่เหมาะสมเพื่อให้ลูกค้าได้เงินคืน"
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-[14px] text-green-600 font-bold mt-auto pt-4"}>
                    {"*(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}
                  </p>
                </div>

                {/* IHD Section */}
                <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                  <h4 className={"text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2"}>{"IHD (Refund)"}</h4>
                  <p className={"text-sm text-blue-700 mb-4"}>{"ดึงเงินค่าคนขับคืนจาก IHD"}</p>
                  {[
                    "ไปที่ Application Inhouse Delivery",
                    "ค้นหาออเดอร์เจ้าปัญหา",
                    "กด Request Refund",
                    "ระบุเหตุผล: Driver took food but customer didn't receive."
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-sm font-bold text-green-600 mt-auto pt-4"}>
                    {"(วิธีนี้ร้านจะได้เงินคืนทั้งค่าอาหารและค่าส่งเดิม)"}
                  </p>
                </div>
              </div>
            )
          }
        }
      }
    }
  },
  'missing-items-top': {
    title: '4. อาหารไม่ครบ',
    options: {
      'refund_missing': {
        title: '1. ร้านทำการ Refund เฉพาะ Items ที่ขาดให้ลูกค้า',
        isFinal: true,
        content: (
          <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
            <div className={"bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm"}>
              <h4 className={"font-bold text-amber-800 mb-4"}>{"ขั้นตอนการคืนเงิน (Partial Refund)"}</h4>
              <StepBox index={0} step={"ไปที่ Application restaurant order-taking app (Local for you) หรือ Stripe"} />
              <StepBox index={1} step={"ค้นหาออเดอร์ที่ลูกค้าแจ้งปัญหา"} />
              <StepBox index={2} step={
                <span>
                  {"ดำเนินการ Refund เฉพาะรายการสินค้าที่ลูกค้าไม่ได้รับ (Partial Refund) "}
                  <a href={"https://youtube.com/shorts/5sZbU404rlQ?feature=share"} target={"_blank"} className={"text-amber-600 underline font-bold"}>{"(ดูวิธีทำได้ที่นี่)"}</a>
                </span>
              } />
            </div>
          </div>
        )
      },
      'resend_missing': {
        title: '2. ร้านส่งรายการอาหารที่ขาดให้ลูกค้า',
        isFinal: true,
        content: (
          <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
            {/* Scenario: Store delivers */}
            <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
              <h4 className={"text-lg font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2 inline-block self-start"}>
                {"กรณี: ร้านไปส่งเอง"}
              </h4>
              <div className={"space-y-3 mt-2"}>
                {[
                  "ร้านอาหารทำรายการอาหารส่วนที่ขาดใหม่",
                  "ร้านดำเนินการนำอาหารไปส่งให้ลูกค้าด้วยตนเองโดยตรง",
                  "แจ้งลูกค้าให้ทราบเวลาที่จะได้รับรายการอาหารที่ขาด"
                ].map((step, i) => (
                  <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                    <span className={"mr-2"}>{i + 1 + "."}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario: Call new driver */}
            <div className={"bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
              <h4 className={"text-lg font-bold text-indigo-700 mb-4 border-b-2 border-indigo-400 pb-2 inline-block self-start"}>
                {"กรณี: เรียกคนขับใหม่"}
              </h4>
              <div className={"space-y-3 mt-2"}>
                <StepBox index={0} step={"1. แจ้งร้านทำอาหารส่วนที่ขาด"} />
                <StepBox index={1} step={"2. เข้า SC เพื่อเอาข้อมูลลูกค้าออเดอร์ดังกล่าวที่ขาด"} />
                <StepBox index={2} step={<span>{"3. เข้าสู่ "}{IHD_ADMIN_LINK}</span>} />
                <StepBox index={3} step={"4. ไปที่เมนู 'Create Order'"} />
                <StepBox index={4} step={"5. กรอกชื่อ-เบอร์โทร-ที่อยู่ ของลูกค้าที่ได้จาก SC"} />
                <StepBox index={5} step={"6. สร้างเลขออเดอร์ใหม่ง่ายๆ (1234) และ ระบุจำนวนสินค้าโดยถามร้าน"} />
                <StepBox index={6} step={"7. ระบุราคาสินค้าเป็น $0 (เพื่อไม่ให้เก็บเงินซ้ำ)"} />
                <StepBox index={7} step={"8. กด Next เพื่อเลือกยี่ห้อคนขับ"} />
                <StepBox index={8} step={"9. กดเรียก Driver มารับอาหารที่ขาดเหลือที่ร้าน (ตรงนี้ทางร้านต้องจ่ายค่าจัดส่งเอง)"} />
              </div>
            </div>
          </div>
        )
      }
    }
  },
  'delivered-not-received': {
    title: '5. สถานะ Delivered แต่ลูกค้าไม่ได้รับ',
    options: {
      'customer_wants_food': {
        title: 'ลูกค้าต้องการอาหารอยู่',
        options: {
          'store_send_direct': {
            title: '1. ร้านไปส่งเอง', isFinal: true,
            content: (
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                <div className={"bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm"}>
                  <h4 className={"font-bold text-amber-700 mb-4"}>{"ร้านอาหาร (ส่งใหม่)"}</h4>
                  {["ร้านทำอาหารใหม่", "นำออเดอร์ไปส่งลูกค้าเอง"].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                </div>
                <div className={"bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm"}>
                  <h4 className={"font-bold text-indigo-700 mb-4"}>{"IHD App"}</h4>
                  {[
                    "ให้ร้านเข้าที่ Inhouse Delivery Application",
                    "เลือกออเดอร์นั้นๆ",
                    "กดจุด 3 จุดมุมขวาบน",
                    "เลือก Request Refund"
                  ].map((step, i) => (
                    <StepBox key={i} index={i} step={step} />
                  ))}
                  <p className={"text-sm font-bold text-green-600 mt-4"}>
                    {"(เพื่อขอเงินคืนกับค่าอาหารที่หายไปกับออเดอร์ก่อนหน้า)"}
                  </p>
                </div>
              </div>
            )
          },
          'call_new_driver_manual': {
            title: '2. เรียกคนขับใหม่ (Manual Order)', isFinal: true,
            content: (
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500"}>
                {/* กล่องซ้าย - เรียกคนขับใหม่ */}
                <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                  <h4 className={"text-lg font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2 inline-block self-start"}>
                    {"IHD App (เรียกคนขับใหม่)"}
                  </h4>
                  <div className={"space-y-3 mt-2"}>
                    {[
                      "แจ้งร้านให้เรียกคนขับอีกครั้ง",
                      "ให้ร้านกดเข้าไปที่ออเดอร์เดิมที่เกิดปัญหา ใน IHD App",
                      "กดจุด 3 จุดบนมุมขวา",
                      <span>{"กด "}<strong>{"Redispatch Order"}</strong></span>
                    ].map((step, i) => (
                      <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                        <span className={"mr-2"}>{i + 1 + "."}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* กล่องขวา - ขอ Refund */}
                <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
                  <h4 className={"text-lg font-bold text-red-700 mb-4 border-b-2 border-red-400 pb-2 inline-block self-start"}>
                    {"IHD App (ขอ Refund ค่าอาหารที่หายไป)"}
                  </h4>
                  <div className={"space-y-3 mt-2"}>
                    {[
                      "เลือกออเดอร์เดิมที่ต้องการเงินคืน",
                      "กดจุด 3 จุดมุมขวาบน",
                      <span>{"เลือก "}<strong>{"Request Refund"}</strong></span>
                    ].map((step, i) => (
                      <div key={i} className={"flex items-start text-sm font-semibold text-gray-800"}>
                        <span className={"mr-2"}>{i + 1 + "."}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <p className={"text-sm font-bold text-green-600 mt-6"}>
                    {"(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}
                  </p>
                </div>
              </div>
            )
          }
        }
      },
      'customer_wants_cancel': {
        title: 'ลูกค้าต้องการยกเลิกออเดอร์', isFinal: true,
        content: (
          <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500"}>
            {/* LFY App Section */}
            <div className={"bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
              <h4 className={"text-xl font-bold text-red-800 mb-4 border-b border-red-200 pb-2"}>{"Full Refund (LFY)"}</h4>
              <p className={"text-sm text-red-700 mb-4"}>{"คืนเงินค่าอาหารและค่าส่งให้ลูกค้า"}</p>
              {[
                "ไปที่ LFY Order-taking App",
                "เลือกออเดอร์ที่ต้องการยกเลิก",
                "กดจุด 3 จุด และเลือก Cancel Order",
                "เลือกเหตุผลที่เหมาะสมเพื่อให้ลูกค้าได้เงินคืน"
              ].map((step, i) => (
                <StepBox key={i} index={i} step={step} />
              ))}
              <p className={"text-[14px] text-green-600 font-bold mt-auto pt-4"}>
                {"*(วิธีนี้ลูกค้าของทางร้านจะได้รับเงิน Refund)"}
              </p>
            </div>

            {/* IHD Section */}
            <div className={"bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col"}>
              <h4 className={"text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2"}>{"IHD (Refund)"}</h4>
              <p className={"text-sm text-blue-700 mb-4"}>{"ดึงเงินค่าคนขับคืนจาก IHD"}</p>
              {[
                "เข้า Application Inhouse Delivery",
                "ค้นหาออเดอร์เจ้าปัญหา",
                "กด Request Refund",
                "ระบุเหตุผล: Driver marked delivered but customer claims not received."
              ].map((step, i) => (
                <StepBox key={i} index={i} step={step} />
              ))}
              <p className={"text-[14px] text-green-600 font-bold mt-auto pt-4"}>
                {"*(วิธีนี้ทางร้านจะได้เงินคืนสำหรับค่าอาหารที่หายไป)"}
              </p>
            </div>
          </div>
        )
      },
      'customer_waits': {
        title: 'รอต่อไป', isFinal: true,
        content: (
          <div className={"space-y-4 animate-in slide-in-from-bottom-2 duration-500"}>
            {/* กล่อง 1: ตรวจสอบรูปภาพหลักฐาน */}
            <div className={"bg-blue-50 border border-blue-200 border-l-4 border-l-blue-600 p-6 rounded-r-2xl shadow-sm"}>
              <p className={"text-[15px] leading-relaxed"}>
                <span className={"font-bold text-blue-800"}>{"ดำเนินการ: ตรวจสอบรูปภาพหลักฐานการส่ง (Check Delivery Proof)"}</span><br/>
                <span className={"text-gray-800"}>{"ให้ CS เข้าไปตรวจสอบรูปภาพการจัดส่งใน "}{IHD_ADMIN_LINK}{" เพื่อยืนยันพิกัดและจุดที่คนขับวางอาหารไว้"}</span>
              </p>
            </div>
            
            {/* กล่อง 2: แจ้งร้านค้า */}
            <div className={"bg-red-50 border border-red-200 border-l-4 border-l-red-600 p-6 rounded-r-2xl shadow-sm"}>
              <p className={"text-[15px] leading-relaxed text-gray-800"}>
                <span className={"font-bold text-red-800"}>{"แจ้งร้านค้า:"}</span> {"รบกวนส่งรูปหลักฐานการส่งให้ลูกค้าตรวจสอบว่าวางถูกจุดหรือไม่ หากลูกค้ายังยืนยันว่าไม่ได้รับหลังจากตรวจสอบรอบบ้านแล้ว ให้ติดต่อกลับมาอีกครั้งเพื่อดำเนินการส่งใหม่หรือคืนเงิน"}
              </p>
            </div>
          </div>
        )
      }
    }
  },
  'call-new-driver': {
    title: '6. เรียกคนขับ IHD มาให้ร้าน',
    description: '(ใช้สำหรับส่งออเดอร์ไป location นั้นๆอีกรอบโดยไม่ผ่านระบบ)\n(พบมากในการที่ร้านส่งอาหารไม่ครบ)',
    isFinal: true,
    content: (
      <div className={"bg-pink-50 border-pink-500 p-6 rounded-2xl border-l-4 shadow-md"}>
        <h4 className={"font-bold text-pink-700 mb-4"}>{"🚀 เรียกคนขับมารับอาหารใหม่"}</h4>
        {[
          "เข้า SC เพื่อเอาข้อมูลลูกค้าออเดอร์ที่ขาดเหลือ / ถามทางร้าน",
          <span>{"เข้าสู่ "}{IHD_ADMIN_LINK}</span>,
          "ไปที่เมนู 'Create Order'",
          "กรอกชื่อ-เบอร์โทร-ที่อยู่ ของลูกค้าที่ได้จาก SC",
          "สร้างเลขออเดอร์ใหม่ง่ายๆ (1234) และ ระบุจำนวนสินค้าโดยถามร้าน",
          "ระบุราคาสินค้าเป็น $0 (เพื่อไม่ให้เก็บเงินซ้ำ)",
          "กด Next เพื่อเลือกยี่ห้อคนขับ",
          "กดเรียก Driver มารับอาหารที่ขาดเหลือที่ร้าน (ตรงนี้ทางร้านต้องจ่ายค่าจัดส่งเอง)"
        ].map((step, i) => (
          <StepBox key={i} index={i} step={step} />
        ))}
      </div>
    )
  }
};
