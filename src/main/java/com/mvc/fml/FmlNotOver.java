package com.mvc.fml;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cont.VerifyCont;
import com.mvc.dao.FmlDao;
import com.util.CmmUtil;

@Service
public class FmlNotOver {
	
	@Autowired
	FmlDao fmlDao;
	
	private static Logger logger = Logger.getLogger(FmlNotOver.class.getName());
	
	public Map<String,Object> notOver(Map<String,Object> fmlInfoMap,List<Map<String, Object>> selAllWinList) {
		Map<String,Object> rtnInfo = new HashMap<String,Object>();
		String fml_cd = String.valueOf(fmlInfoMap.get("fml_cd"));
		try {
				
				String fml_group = String.valueOf(fmlInfoMap.get("fml_group"));
				String fml_judg = String.valueOf(fmlInfoMap.get("fml_judg"));
				String fml_tbl = String.valueOf(fmlInfoMap.get("fml_tbl"));
				int check_chapter = Integer.parseInt(String.valueOf(fmlInfoMap.get("check_chapter")));
				String state = String.valueOf(fmlInfoMap.get("state"));
				int rang_cnt = Integer.parseInt(String.valueOf(fmlInfoMap.get("rang_cnt")));
				int inc_cnt = Integer.parseInt(String.valueOf(fmlInfoMap.get("inc_cnt")));
				String use_yn = String.valueOf(fmlInfoMap.get("use_yn"));
				int err_last_chapter = Integer.parseInt(String.valueOf(fmlInfoMap.get("err_last_chapter")));
				int agv = Integer.parseInt(String.valueOf(fmlInfoMap.get("agv")));
				int point = Integer.parseInt(String.valueOf(fmlInfoMap.get("point")));
			
				if(check_chapter < 50) {
					check_chapter = 50;
				}
				//fmlInfoMap.get("fml_tbl") 이 from 절에 table 됨 stair
				List<Map<String,Object>> chkList =  fmlDao.selFmlInfoList(fmlInfoMap);
				
				Map<String,Object> chkMap = null;
				Map<String,Object> winnerMap = null;
				Map<String,Object> newFmlMap = new HashMap<String,Object>();
				int[] chkArray = null;
				int[] selAllWinArray = null;
				int notOverCnt = 0;
				boolean bln_insNewChapter = false;
				// winner_chapter 한칸 전까지
				// inc_cnt 낮음에서 높음으로
				newFmlMap.putAll(fmlInfoMap);
				newFmlMap.put("fml_cd", fml_group+"_"+fml_judg+"_"+rang_cnt+"_"+(inc_cnt+1));
				newFmlMap.put("inc_cnt", inc_cnt+1);
				//새로운 내용 있는지 확인 
				
				logger.info("fmlDao.selNewFml(newFmlMap) : "+fmlDao.selNewFml(newFmlMap));
				if(fmlDao.selNewFml(newFmlMap) == null  //기존에 내용이 없어야 하며
						&& Integer.parseInt(String.valueOf(newFmlMap.get("inc_cnt"))) < 7 //포함은 6개이상 될수가 없고 
						&& Integer.parseInt(String.valueOf(newFmlMap.get("inc_cnt"))) <= Integer.parseInt(String.valueOf(newFmlMap.get("rang_cnt"))) //포함 숫자는 기본 범위를 넘을 수 없다 
						) {
					bln_insNewChapter = true;
				}
				// winner_chapter 한칸 전까지 why....stair 나온걸로 다음 회차당첨여부를 확인해야하니!!확인할 것이 있어야 한다!
				for(int i = check_chapter ; i < selAllWinList.size()-1 ; i++) {
					chkMap = chkList.get(i);
					//계단식 
					if(chkMap != null) {
						
						winnerMap = selAllWinList.get(i+1);
						
						
						chkArray = CmmUtil.map45ToIntArray(chkMap);
						selAllWinArray = CmmUtil.map6ToIntArray(winnerMap);
						notOverCnt = 0;
						
						for(int j = 0 ; j < 45 ; j++) {
							
							for(int k = 0 ; k < 6 ; k++ ) {
								
								if(chkArray[j] == selAllWinArray[k]) {
									notOverCnt++;
								}
								
							}
							
							if((j+1)%rang_cnt == 0) {
								
								if(notOverCnt >= inc_cnt) {
									//에러식 증가
									//to-do : 히스토리 남기고 세부내용 증가 시켜야 함.
									fmlInfoMap.put("err_last_chapter", i+1);
									fmlDao.udpFmlErrLastChapter(fmlInfoMap);
									if(bln_insNewChapter){
										fmlDao.insNewFml(newFmlMap);
										bln_insNewChapter = false;
										//VerifyCont.VERIFY_CHECK_LIST 에 새로운 내용을 추가 해서 FOR문을 더 이어갈려 했지만 불가능 
										//VerifyCont.VERIFY_CHECK_LIST.add(newFmlMap);
									}
								}
								notOverCnt = 0;
							}
						}
					}
				}
				String startDt = VerifyCont.VERIFY_ACTIVE_THREAD_MAP.get(fml_cd).toString();
				logger.info(fml_cd+" start_Dt : "+startDt);
				VerifyCont.VERIFY_ACTIVE_THREAD_MAP.remove(fml_cd);
				
		}catch(Exception ex) {
			logger.info("@@@@@@ NOTOVER ERROR3 "+fml_cd+":"+ ex.toString());
		}
	 	
        return rtnInfo;
	}
		
}
