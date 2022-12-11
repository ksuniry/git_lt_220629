package com.core;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.cont.CmmCont;


@EnableAsync
@Configuration
public class ThreadExecutorUtil{

	private Logger logger = Logger.getLogger(ThreadExecutorUtil.class.getName());
	
	@Bean(name="threadExcutor")
	public ThreadPoolTaskExecutor threadExcutor() {
		ThreadPoolTaskExecutor threadExcutor = new ThreadPoolTaskExecutor();
		threadExcutor.setCorePoolSize(CmmCont.THREAD_TOTAL_COUNT);
		return threadExcutor;
	}
	

}
