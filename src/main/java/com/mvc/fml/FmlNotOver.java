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
				List<Map<String,Object>> chkList =  fmlDao.selFmlInfoList(fmlInfoMap);
				
				Map<String,Object> chkMap = null;
				Map<String,Object> winnerMap = null;
				Map<String,Object> newFmlMap = new HashMap<String,Object>();
				int[] chkArray = null;
				int[] selAllWinArray = null;
				int notOverCnt = 0;
				boolean bln_insNewChapter = false;
				// winner_chapter 한칸 전까지
				
				newFmlMap.putAll(fmlInfoMap);
				newFmlMap.put("fml_cd", fml_group+"_"+fml_judg+"_"+rang_cnt+"_"+(inc_cnt+1));
				newFmlMap.put("inc_cnt", inc_cnt+1);
				if(fmlDao.selNewFml(newFmlMap) == null && inc_cnt+1 < 7) {
					bln_insNewChapter = true;
				}
				
				for(int i = check_chapter ; i < selAllWinList.size()-1 ; i++) {
					chkMap = chkList.get(i);
					
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
										VerifyCont.VERIFY_CHECK_LIST.add(fmlDao.selNewFml(newFmlMap));
									}
								}
								notOverCnt = 0;
							}
						}
					}
				}
				
		}catch(Exception ex) {
			logger.info("@@@@@@ NOTOVER ERROR3 "+fml_cd+":"+ ex.toString());
		}
	 	
        return rtnInfo;
	}
		
}
